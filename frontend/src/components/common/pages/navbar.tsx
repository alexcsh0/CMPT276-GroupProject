import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, MenuItem, Menu, Avatar, Tooltip, Badge } from "@mui/material";
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './navbar.module.css';

const userPages = ['Calendar', 'Routes'];
const adminPages = ['Alerts', 'Schedule'];
const settings = ['Profile', 'Settings', 'Logout'];

type UserRole = 'newUser' | 'existingUser' | 'admin';

interface Props {
  role: UserRole;
}

const Navbar: React.FC<Props> = ({ role }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const renderNavItems = () => {
    let pages = role === 'admin' ? [...userPages, ...adminPages] : userPages;

    if (role === 'newUser') {
      return null;
    }

    return (
      <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
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
          <DirectionsTransitIcon className={styles.logo} />
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            Transit App
            {renderNavItems()}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {role === 'newUser' ? (
            <>
              <Button color="inherit">Login</Button>
              <Button color="inherit">Sign up</Button>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {role === 'existingUser' || role === 'admin' ? (
                <>
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
              ) : null}
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
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
