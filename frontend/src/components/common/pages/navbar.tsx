import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, MenuItem, Menu, Avatar, Tooltip, Badge } from "@mui/material";
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './navbar.module.css';
import { useUser, UserTypes } from "../user-context/user-context";
import { useNavigate } from "react-router-dom";

const userPages = ['Calendar', 'Routes'];
const adminPages = ['Alerts', 'Schedule'];
const settings = ['Profile', 'Settings', 'Logout'];

export function NavBar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const renderNavItems = () => {
    const pages = user?.userType === UserTypes.Admin ? [...userPages, ...adminPages] : userPages;

    if (!user) {
      return null;
    }

    return (
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexGrow: 1 }}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block', '&:hover': { fontWeight: 'bold' } }}
          >
            {page}
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsTransitIcon className={styles.logo} />
            <Typography variant="h6" component="div">
              Route Alert
            </Typography>
          </Box>
          {renderNavItems()}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            {!user ? (
              <>
                <Button color="inherit" onClick={handleLoginClick}>Login</Button>
                <Button color="inherit" onClick={handleSignUpClick}>Sign up</Button>
              </>
            ) : (
              <>
                {/* {role === 'existingUser' || role === 'admin' ? (
                  <>
                    <Tooltip title="Alert Notifications">
                      <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        sx={{ mr: 2 }}
                        onClick={handleOpenNotificationsMenu}
                      >
                        <Badge badgeContent={17} color="error">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-notifications"
                      anchorEl={anchorElNotifications}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElNotifications)}
                      onClose={handleCloseNotificationsMenu}
                    >
                      <MenuItem onClick={handleCloseNotificationsMenu}>Alert 1</MenuItem>
                      <MenuItem onClick={handleCloseNotificationsMenu}>Alert 2</MenuItem>
                      <MenuItem onClick={handleCloseNotificationsMenu}>Alert 3</MenuItem>
                    </Menu>
                  </>
                ) : null} */}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center" sx={{ '&:hover': { fontWeight: 'bold' } }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
