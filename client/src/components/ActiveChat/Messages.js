import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, OtherUserTypingBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, typing, lastReadMessageId } = props;
  React.useEffect(() => {
    const startReadFrom = document.getElementById(`message-focus-${lastReadMessageId}`);
    if(startReadFrom) {
      startReadFrom.scrollIntoView({behavior:'smooth',block:'start'});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Box>
      {messages
        .map((message) => {
          const time = moment(message.createdAt).format("h:mm");

          return message.senderId === userId ? (
            <SenderBubble key={message.id} id={message.id}
              lastReadMessageId={lastReadMessageId}
              text={message.text} time={time}
              otherUser={otherUser}
            />
          ) : (
            <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
          );
      })}
      {typing&&<OtherUserTypingBubble otherUser={otherUser} />}
    </Box>
  );
};

export default Messages;
