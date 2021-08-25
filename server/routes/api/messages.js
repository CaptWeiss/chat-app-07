const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      const onlineUser = onlineUsers[sender.id];
      if (onlineUser) {
        sender.online = onlineUser.online;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch("/markRead", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    
    const userId = req.user.id ;
    const {conversationId} = req.body ;
    if(!conversationId) return res.status(400).json({message:"conversationId is required"}) ;
    const existingConvo = await Conversation.findOne({
      where: {
        id: {
          [Op.eq]: conversationId
        },
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      }
    });
    const convoJSON = existingConvo.toJSON();
    
    if (convoJSON === null) return res.sendStatus(403);
    
    const messages = await Message.update({read:true},{
      where: {
        conversationId: {
          [Op.eq]: conversationId,
        },
        senderId: {
          [Op.not]: userId,
        },
        read: {
          [Op.eq]: false,
        }
      },
      returning: true
    });
    const resDate = {
      conversationId,
      updatedMessages: messages[1].map(message=>({id: message.id, createdAt: message.createdAt})),
      updatedMessagesCount: messages[0]
    }
    res.status(200).json(resDate);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
