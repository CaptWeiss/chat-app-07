import React, {useEffect, useRef} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, OtherUserTypingBubble } from ".";
import moment from "moment";

const Messages = ({ messages, otherUser, userId, typing, lastReadMessageId }:IMessagesProps) => {
  const msgEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if(msgEndRef.current) {
      msgEndRef.current.scrollIntoView({behavior:'smooth',block:'start'});
    }
  },[messages.length]);

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
      <div ref={msgEndRef}></div>
    </Box>
  );
};

export default Messages;

interface IMessagesProps {
  messages: IMessageDTO[];
  otherUser: IOtherUserDTO;
  userId: number;
  typing: boolean;
  lastReadMessageId: number;
}
