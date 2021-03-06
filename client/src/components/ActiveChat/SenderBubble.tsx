import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  avatar: {
    height: 20,
    width: 20,
    position: "relative",
    bottom: "1px",
    marginBottom: "1rem",
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  }
}));

const SenderBubble = ({time,text,lastReadMessageId,id,otherUser}: ISenderBubbleProps) => {
  const classes = useStyles();
  
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      {
        (lastReadMessageId===id)&&
        <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
      }
    </Box>
  );
};

export default SenderBubble;

interface ISenderBubbleProps {
  time: string;
  text: string;
  lastReadMessageId: number;
  id: number;
  otherUser: IOtherUserDTO;
}
