import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';

const drawerWidth = '30vw';
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 89,
    boxShadow: "0 2px 20px 0 rgba(88,133,196,0.10)"
  },
  content: {
    display: "flex",
    alignItems: "center",
    width: '100%',
    justifyContent: 'flex-end'
  },
  username: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginRight: 14,
    color: '#000'
  },
  statusText: {
    fontSize: 12,
    color: "#BFC9DB",
    letterSpacing: -0.17
  },
  statusDot: {
    height: 8,
    width: 8,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#D0DAE9"
  },
  online: {
    background: "#1CED84",
    marginLeft: '1rem'
  },
  ellipsis: {
    color: "#95A7C4",
    marginRight: 24,
    opacity: 0.5
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    margin: '0.4rem 1rem 0 1rem',
    width: 'calc(100% - 2rem)',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - calc(${drawerWidth} + 2rem))`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: '#000',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  otherUserStatusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  otherUserStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
}));

const Header = ({ username, online, handleDrawerToggle }: IHeaderProps) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={`${classes.appBar} ${classes.root}`}>
      <Toolbar className={classes.content}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Box className={classes.otherUserStatusBar}>
          <Box className={classes.otherUserStatus}>
            <Typography className={classes.username}>{username}</Typography>
            <Box className={`${classes.statusDot} ${online&&classes[online&&"online"]}`}></Box>
            {
              username&&
              <Typography className={classes.statusText}>{online ? "Online" : "Offline"}</Typography>
            }
          </Box>
          <MoreHorizIcon classes={{ root: classes.ellipsis }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

interface IHeaderProps {
  username?: String;
  online?: Boolean;
  handleDrawerToggle(): void;
}
