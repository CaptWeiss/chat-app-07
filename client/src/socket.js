import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setTypingFlag,
  setReadStatus
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("typing", (data) => {
    store.dispatch(setTypingFlag(data.conversationId,data.typing));
  });
  socket.on("read-reciept", (data) => {
    store.dispatch(setReadStatus(data.updatedMessagesId, data.conversationId));
  });
});

export default socket;
