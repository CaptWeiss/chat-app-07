import {findMsgReadStatus} from './thunkCreators';

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    const meta = findMsgReadStatus(newConvo);
    newConvo.lastReadMessageId = meta.lastReadMessageId;
    newConvo.unreadMessages = meta.unreadMessages;
    return [newConvo,...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const updatedConvo = {...convo} ;
      updatedConvo.messages.push(message);
      updatedConvo.latestMessageText = message.text;
      const meta = findMsgReadStatus(updatedConvo);
      updatedConvo.lastReadMessageId = meta.lastReadMessageId;
      updatedConvo.unreadMessages = meta.unreadMessages;
      return updatedConvo;
    } else {
      return convo;
    }
  }).sort((a,b) => {
    if(a.id===message.conversationId) return -1
    if (b.id === message.conversationId) return +1
    return 0;
  })
  ;
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const updatedConvo = {...convo} ;
      updatedConvo.id = message.conversationId;
      updatedConvo.messages.push(message);
      updatedConvo.latestMessageText = message.text;
      updatedConvo.typing = false;
      const meta = findMsgReadStatus(updatedConvo);
      updatedConvo.lastReadMessageId = meta.lastReadMessageId;
      updatedConvo.unreadMessages = meta.unreadMessages;
      return updatedConvo;
    } else {
      return convo;
    }
  });
};

export const updateTypingFlagInStore = (state, payload) => {
  return state.map((convo) => {
    return convo.id === payload.conversationId ?
    {
      ...convo,
      typing: payload.typing
    } : convo
  });
}

export const updateReadStatusInStore = (state, payload) => {
  const {conversationId,updatedMessagesId} = payload ;
  return state.map(convo => {
    if (convo.id === conversationId) {
      const updatedConvo = {...convo} ;

      updatedConvo.messages = updatedConvo.messages.map(message => {
        return updatedMessagesId.includes(message.id) ?
          {...message,read: true}:message;
      });
      const meta = findMsgReadStatus(updatedConvo);
      updatedConvo.unreadMessages = meta.unreadMessages;
      updatedConvo.lastReadMessageId = meta.lastReadMessageId;
      return updatedConvo;
    } else {
      return convo;
    }
  })
}
