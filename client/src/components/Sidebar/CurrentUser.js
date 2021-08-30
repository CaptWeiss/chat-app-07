import React, {useState, useRef} from "react";
import { Box, Typography, Button, Popover} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { BadgeAvatar } from "./index";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { logout } from "../../store/utils/thunkCreators";
import { clearOnLogout } from "../../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 44,
    marginTop: 23,
    marginLeft: 6,
    display: "flex",
    alignItems: "center"
  },
  subContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1
  },
  username: {
    letterSpacing: -0.23,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 17
  },
  ellipsis: {
    color: "#95A7C4",
    marginRight: 24,
    opacity: 0.5,
    cursor: 'pointer'
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const CurrentUser = ({user:mayBeUser,logout}) => {
  const user = mayBeUser || {};
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorEl = useRef(null);

  const openDropdown = (event) => {
    anchorEl.current= event.currentTarget;
    setOpen(true);
  };
  const closeDropdown = () => {
    anchorEl.current = null
    setOpen(false);
  }

  const handleLogout = async () => {
    if(user.id) {
      await logout(user.id);
    }
  };

  return (
    <Box className={classes.root}>
      <BadgeAvatar photoUrl={user.photoUrl} online={true} />
      <Box className={classes.subContainer}>
        <Typography className={classes.username}>{user.username}</Typography>
        <MoreHorizIcon aria-describedby='username-dropdown' classes={{ root: classes.ellipsis }} onClick={openDropdown} />
        <Popover
          id={'username-dropdown'}
          open={open}
          anchorEl={anchorEl.current}
          onClose={closeDropdown}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.paper}>
            <Button className={classes.logout} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Popover>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    }
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(CurrentUser);
