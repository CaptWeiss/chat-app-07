import React, { Component } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage,broadcastTypingState,postReadReceipt } from "../../store/utils/thunkCreators";

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

class Input extends Component {
  timer = null
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      typing: false,
    };
  }

  componentWillUnmount() {
    if(this.timer) clearTimeout(this.timer);
  }

  handleChange = (event) => {
    if(this.timer) clearTimeout(this.timer);
    this.setState({
      text: event.target.value,
      typing: true,
    });
    this.sendTyping(event.target.value.length>0, this.state.typing);
    this.timer = setTimeout(()=>{
      this.sendTyping(false,this.state.typing)
      this.setState({typing: false});
    },3000);
  };

  sendTyping(state,prevState=this.state.typing) {
    if(this.props.conversationId) {
      if (!(prevState === state)) {
        this.props.broadcastTypingState({
          conversationId: this.props.conversationId,
          recipientId: this.props.otherUser.id,
          typing: state
        });
      }
    }
  }

  handleBlur = (event) => {
    if (this.timer) clearTimeout(this.timer);
    this.sendTyping(false, this.state.typing);
    this.setState({typing: false});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const text = event.target.text.value;
    if (!text || text.lenght === 0) return;
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text,
      recipientId: this.props.otherUser.id,
      conversationId: this.props.conversationId,
      sender: this.props.conversationId ? null : this.props.user,
    };
    this.sendTyping(false, true);
    await this.props.postMessage(reqBody);
    this.setState({
      text: "",
      typing: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <FormControl fullWidth hiddenLabel>
          <FilledInput
            classes={{ root: classes.input }}
            disableUnderline
            placeholder="Type something..."
            value={this.state.text}
            name="text"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </FormControl>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    broadcastTypingState: (payload) => {
      broadcastTypingState(payload);
    },
    postReadReceipt: (conversationId) => {
      dispatch(postReadReceipt({conversationId}));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
