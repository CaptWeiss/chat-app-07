import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Messages } from "./index";
import { connect } from "react-redux";
import {postReadReceipt} from '../../store/utils/thunkCreators'

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
    minHeight: "85vh"
  }
}));

const ActiveChat = ({conversation,postReadReceipt,user}: IActiveChatProps) => {
  const classes = useStyles();

  useEffect(() => {
    if (conversation.id && (conversation.unreadMessages>0)) {
      postReadReceipt(conversation.id);
    }
  },[conversation.id, conversation.unreadMessages, postReadReceipt]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              lastReadMessageId={conversation.lastReadMessageId}
              typing={conversation.typing}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const defaultConvo: IConversationDTO = {
  id: 0,
  lastReadMessageId: 0,
  latestMessageText: '',
  messages: [],
  otherUser: { id: 0, photoUrl: '', username: '' },
  typing: false,
  unreadMessages: 0,
  user2: null
}

const mapStateToProps = (state: IStateDTO) => {
  console.log('mapStateToProps: ', {state});
  return {
    user: state.user,
    conversation:
      state.conversations && (
        state.conversations.find(
          (conversation) => conversation.otherUser.username === state.activeConversation
        ) || defaultConvo
      )
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    postReadReceipt: (conversationId:number) => {
      dispatch(postReadReceipt({
        conversationId
      }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveChat);

interface IActiveChatProps {
  conversation: IConversationDTO;
  user: IUserDTO;
  postReadReceipt(conversationId:number): void;
}
