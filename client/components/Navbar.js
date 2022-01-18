import {
  Box,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, setActiveProject } from '../store';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Navbar = ({ handleSignout, isLoggedIn, activeProject }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [drawerOpen, setDrawer] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawer(open);
  };

  /* INSIDE MENU:

            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}

            */

  return (
    <>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {activeProject.id && (
              <>
                <ListItemButton
                  component={Link}
                  to={`/projects/${activeProject.id}/notes`}
                >
                  <ListItemIcon>
                    <StickyNote2Icon />
                  </ListItemIcon>
                  <ListItemText primary="Notes" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to={`/projects/${activeProject.id}/lights`}
                >
                  <ListItemIcon>
                    <LightbulbIcon />
                  </ListItemIcon>
                  <ListItemText primary="Lights" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to={`/projects/${activeProject.id}/types`}
                >
                  <ListItemIcon>
                    <LocalOfferIcon />
                  </ListItemIcon>
                  <ListItemText primary="Types" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeProject.id && activeProject.name + ' - '}EasyALD
          </Typography>
          {isLoggedIn ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem component={Link} to="/projects" onClick={handleClose}>
                  Projects
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSignout();
                    handleClose();
                  }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button component={Link} to="/login">
                Login
              </Button>
              <Button component={Link} to="/signup">
                Create account
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
    // <div>
    //   <h1>Easy ALD</h1>
    //   <nav>
    //     {isLoggedIn ? (
    //       <div>
    //         {/* The navbar will show these links after you log in */}
    //         <Link to="/home">Home</Link>
    //         <Link to="/projects/1/lights">Lights</Link>
    //         <Link to="/projects/1/notes">Notes</Link>
    //         <Link to="/projects/1/types">Types</Link>
    //         <a href="#" onClick={handleClick}>
    //           Logout
    //         </a>
    //       </div>
    //     ) : (
    //       <div>
    //         {/* The navbar will show these links before you log in */}
    //
    //       </div>
    //     )}
    //   </nav>
    //   <hr />
    // </div>
  );
};

const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    activeProject: state.activeProject,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSignout() {
      dispatch(logout());
      dispatch(setActiveProject({}));
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
