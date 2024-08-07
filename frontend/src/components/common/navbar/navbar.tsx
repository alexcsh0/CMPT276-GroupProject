import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  Link
} from '@mui/material';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import { useUser, UserTypes } from '../user-context/user-context';

const userPages = ['Calendar', 'Routes', 'Weather'];
const adminPages = ['Alerts'];
const settings = ['Logout'];

/**
 * Project-wide navigation bar
 * @returns NavBar react component
 */
export function NavBar() {
  const { user } = useUser();

  const pages =
    user?.userType === UserTypes.Admin
      ? [...userPages, ...adminPages]
      : userPages;

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Link
          href="/"
          underline="none"
          color="secondary"
          sx={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-start',
            flex: 1
          }}
          data-testid="navbar-home-link"
        >
          <DirectionsTransitIcon sx={{ marginRight: 1 }} />
          <Typography variant="h6" component="div">
            Route Alert
          </Typography>
        </Link>

        <Box display="flex" justifyContent="center" gap={4} flex={1}>
          {pages.map((page) => (
            <Link
              key={page}
              href={`/${page.toLowerCase()}`}
              color="secondary"
              underline="none"
              textTransform="uppercase"
              data-testid={`navbar-link-${page.toLowerCase()}`}
            >
              {page}
            </Link>
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" flex={1}>
          {user ? (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} data-testid="navbar-avatar">
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Menu
                id="menu-appbar"
                anchorEl={userMenuAnchor}
                open={!!userMenuAnchor}
                onClose={handleCloseUserMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                sx={{ mt: '45px' }}
                data-testid="navbar-user-menu"
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu} data-testid={`navbar-menuitem-${setting.toLowerCase()}`}>
                    <Link
                      href={`/${setting.toLowerCase()}`}
                      underline="none"
                      sx={{
                        color: 'black',
                        '&:hover': { fontWeight: 'bold' }
                      }}
                    >
                      {setting}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                component={Button}
                color="secondary"
                underline="none"
                textTransform="none"
                data-testid="navbar-login-link"
              >
                Log In
              </Link>
              <Link
                href="/register"
                component={Button}
                color="secondary"
                underline="none"
                textTransform="none"
                data-testid="navbar-register-link"
              >
                Sign Up
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
