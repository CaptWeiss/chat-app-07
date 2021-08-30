import React, { useEffect, useRef, useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage,broadcastTypingState } from "../../store/utils/thunkCreators";

const styles = makeStyles({
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
    position: 'sticky',
    bottom: 0
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
    "&:hover": {
      backgroundColor: 'rgb(218, 218, 232)',
    },
  },
  form: {
    backgroundColor: '#FAFAFA'
  }
});

const init: IStateDTO = {
  text: '',
  typing: false
}

function Input({user,otherUser,conversationId,postMessage,broadcastTypingState}: IInputProps) {
  const [state, setState] = useState<IStateDTO>(init);
  const timer = useRef<NodeJS.Timeout>();
  const classes = styles();
  
  useEffect(() => {
    return () => {
      if(timer.current) clearTimeout(timer.current);
    }
  },[])


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (timer.current) clearTimeout(timer.current);
    setState({
      text: event.target.value,
      typing: true,
    });
    sendTyping(event.target.value.length>0, state.typing);
    timer.current = setTimeout(()=>{
      sendTyping(false, state.typing)
      setState(prev => ({...prev, typing: false}));
    },3000);
  };

  function sendTyping(state: boolean, prevState?:boolean) {
    if(conversationId) {
      if (!(prevState === state)) {
        broadcastTypingState({
          conversationId,
          recipientId: otherUser.id,
          typing: state
        });
      }
    }
  }

  const handleBlur = () => {
    if (timer.current) clearTimeout(timer.current);
    sendTyping(false, state.typing);
    setState(prev => ({...prev, typing: false}));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = state.text;
    if (!text || text.length === 0) return;
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
    };
    sendTyping(false, true);
    postMessage(reqBody);
    setState(init);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl className={classes.form} fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={state.text}
          name="text"
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    postMessage: (message: IPostMessage) => {
      dispatch(postMessage(message));
    },
    broadcastTypingState: (payload:IBroadcastTypingState) => {
      broadcastTypingState(payload);
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Input);


interface IInputProps {
  conversationId: number;
  otherUser: IOtherUserDTO;
  user: IUserDTO;
  broadcastTypingState(payload: IBroadcastTypingState): void;
  postMessage(message: IPostMessage): void;
}
interface IPostMessage {
  text: string,
  recipientId: number,
  conversationId: number,
  sender: IUserDTO|null,
}
interface IBroadcastTypingState {
  conversationId:number,
  recipientId: number,
  typing: boolean
}
interface IStateDTO {
  text: string,
  typing: boolean
}
