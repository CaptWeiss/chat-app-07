import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setReadStatus
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";


// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    const sortedData = data.map(convo => ({
      ...convo,
      messages: convo.messages.sort((a, b) => {
        return new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf();
      }),
      typing: false
    }))
    const modifiedData = sortedData.map(convo => {
      const meta = findMsgReadStatus(convo);
      return {
        ...convo,
        lastReadMessageId: meta.lastReadMessageId,
        unreadMessages: meta.unreadMessages
      }
    })
    dispatch(gotConversations(modifiedData));
  } catch (error) {
    console.error(error);
  }
};

export function findMsgReadStatus(convo) {
  const receivedMsgs = convo.messages.filter(msg => msg.senderId===convo.otherUser.id);
  const sentMsgs = convo.messages.filter(msg => msg.senderId!==convo.otherUser.id);
  let lastReadMessageId = -1
  let readCount = 0;
  const msgsLength = sentMsgs.length;
  
  sentMsgs.forEach((msg,idx,arr) => {
    const nextMsgIdx = idx+1;
    if(msg.read) {
      if((nextMsgIdx<msgsLength)&&(!arr[nextMsgIdx].read)) lastReadMessageId = msg.id;
      readCount++;
    }
  })

  if ((lastReadMessageId === -1) && (readCount === msgsLength)) {
    lastReadMessageId = sentMsgs[msgsLength-1]?.id||-1;
  }

  let unreadMessages = 0;
  receivedMsgs.forEach(msg => {
    if (!msg.read) unreadMessages++;
  })
  return {
    lastReadMessageId,
    unreadMessages
  }
}

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  if(!body) return;
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const postReadReceipt = (body) => async (dispatch) => {
  if(!body?.conversationId) return;
  try {
    const { data } = await axios.patch("/api/messages/markRead", body);
    const {updatedMessages,conversationId,updatedMessagesCount} = data;
    if (updatedMessagesCount===0) return;
    const updatedMessagesId = updatedMessages.map(msg=>msg.id);
    dispatch(setReadStatus(updatedMessagesId, conversationId));
    socket.emit("read-reciept", {
      updatedMessagesId,
      conversationId,
    });
  } catch (error) {
    console.error(error);
  }
}

export const broadcastTypingState = (payload) => {
  socket.emit("typing", payload);
}

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
