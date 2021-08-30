import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { fetchConversations } from "../store/utils/thunkCreators";
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import {Header} from './ActiveChat';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = '30vw';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: "97vh",
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: '100vw',
    height: '100vh',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      overflow: 'scroll',
      scrollbarWidth: 'none', // Firefox
      '-ms-overflow-style': 'none', // IE and Edge
      '&::-webkit-scrollbar': {
          display: 'none',
      }
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Home({fetchConversations,user,conversation}) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchConversations();
  },[fetchConversations])

  useEffect(() => {
    if (user.id) {
      setIsLoggedIn(true)
    }
  },[user.id])
  
  if (!user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBubbledEvent = (event) => {
    event.stopPropagation();
    const targetEl = event.target ;
    const selectedChat = targetEl.dataset['selectedChat'] || targetEl.parentElement.dataset['selectedChat'];
    if(!!selectedChat) setMobileOpen(!mobileOpen) ;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle} 
        username={conversation?.otherUser.username}
        online={conversation?.otherUser.online || false}
      />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            anchor='top'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClick={handleBubbledEvent}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <SidebarContainer />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <SidebarContainer />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {
          !!conversation&&
          < ActiveChat />
        }
      </main>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchConversations: () => {
            dispatch(fetchConversations());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
