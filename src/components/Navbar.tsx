'use client'

import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Container,
  Avatar, Button, Tooltip, Box, Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logout } from '@/src/actions/logout';
import { getAllMessagesForStudent } from '@/src/app/data/messages';

const pages = ['Post', 'Messages'];
const settings = ['Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { data: session } = useSession();
  
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

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (session && session.user && session.user.id) {
        try {
          const messages = await getAllMessagesForStudent(session.user.id);
          const unreadCount = (messages ?? []).filter(message => !message.viewed).length;
          setUnreadMessages(unreadCount);
        } catch (error) {
        }
      }
    };
    fetchMessages();
  }, [session]);
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for large screens */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link href="/" passHref>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              FME Student
            </Typography>
          </Link>

          {/* Mobile view menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 3 }}
                >
                  <Link href={`/${page.toLowerCase()}`} passHref style={{ width: '100%', display: 'flex', textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {page === 'Messages' ? (
                        unreadMessages > 0 ? (
                          <Badge
                            key={page}
                            badgeContent={unreadMessages}
                            color="error"
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            sx={{
                              '& .MuiBadge-badge': {
                                top: '50%',
                                right: '-15px',
                                transform: 'translate(50%, -50%)',
                              },
                            }}
                          >
                            <Typography textAlign="center" sx={{ flexGrow: 1 }}>{page}</Typography>
                          </Badge>
                        ) : (
                          <Typography textAlign="center" sx={{ flexGrow: 1 }}>{page}</Typography>
                        )
                      ) : (
                        <Typography textAlign="center" sx={{ flexGrow: 1 }}>{page}</Typography>
                      )}
                    </Box>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile view */}
          <Link href="/" passHref>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              FME Student
            </Typography>
          </Link>
          
          {/* Desktop view menu buttons */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page} href={`/${page.toLowerCase()}`} passHref>
                {page === 'Messages' ? (
                  unreadMessages > 0 ? (
                    <Badge
                      key={page}
                      badgeContent={unreadMessages}
                      color="error"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      sx={{
                        '& .MuiBadge-badge': {
                          top: '35%',
                          right: '-15px',
                          transform: 'translateY(-50%)',
                        },
                      }}
                    >
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        {page}
                      </Button>
                    </Badge>
                  ) : (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page}
                    </Button>
                  )
                ) : (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                )}
              </Link>
            ))}
          </Box>

          {/* User avatar and settings menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={session?.user?.name || 'U'} src={session?.user?.image || ''}>
                  {!session?.user?.image && session?.user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => {
                  if (setting === 'Logout') {
                    handleLogout();
                  } else {
                    handleCloseUserMenu();
                  }
                }}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
