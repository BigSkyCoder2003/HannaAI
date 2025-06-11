'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  SmartToy,
  Settings,
  Logout,
  Chat,
  AccountCircle,
  Home,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 50%, #3d8b3d 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: 0
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Brand */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: { xs: 2, md: 6 },
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
            onClick={() => handleNavigation('/chat')}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 36, md: 44 },
                height: { xs: 36, md: 44 },
                borderRadius: 2,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mr: { xs: 1.5, md: 2 },
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              <SmartToy sx={{ fontSize: { xs: 20, md: 24 }, color: 'white' }} />
            </Box>
            <Typography 
              variant={{ xs: 'h6', md: 'h5' }}
              component="div" 
              fontWeight="800"
              sx={{
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              HannaAI
            </Typography>
          </Box>

          {/* Desktop Navigation Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Button
              color="inherit"
              startIcon={<Chat />}
              onClick={() => handleNavigation('/chat')}
              sx={{ 
                borderRadius: 3,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                background: pathname === '/chat' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: pathname === '/chat' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                backdropFilter: pathname === '/chat' ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              Chat
            </Button>
            <Button
              color="inherit"
              startIcon={<Settings />}
              onClick={() => handleNavigation('/profile')}
              sx={{ 
                borderRadius: 3,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                background: pathname === '/profile' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: pathname === '/profile' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                backdropFilter: pathname === '/profile' ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              Profile
            </Button>
          </Box>

          {/* Desktop Status Chips */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 2, mr: 4 }}>
            {userProfile?.googleDriveFolderId && (
              <Chip
                label="Drive Linked"
                size="small"
                sx={{ 
                  bgcolor: 'rgba(173, 216, 230, 0.9)', 
                  color: '#1e3a8a',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            )}
          </Box>

          {/* Desktop Quick Logout Button */}
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              display: { xs: 'none', md: 'flex' },
              borderRadius: 3,
              px: 3,
              py: 1.5,
              mr: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.4)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
          >
            Sign Out
          </Button>

          {/* Mobile Spacer - pushes avatar to far right */}
          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} />

          {/* User Avatar */}
          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{
                p: 0.5,
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              {user.photoURL ? (
                <Avatar 
                  src={user.photoURL} 
                  alt="Profile"
                  sx={{ 
                    width: { xs: 32, md: 40 }, 
                    height: { xs: 32, md: 40 },
                    border: '2px solid rgba(255,255,255,0.3)'
                  }} 
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: { xs: 32, md: 40 }, 
                    height: { xs: 32, md: 40 }, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontSize: { xs: '0.9rem', md: '1.1rem' }
                  }}
                >
                  {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </Avatar>
              )}
            </IconButton>
            
            {/* Desktop User Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                display: { xs: 'none', md: 'block' },
                mt: 1.5,
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  minWidth: 240,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box sx={{ px: 3, py: 2, background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%)' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  Signed in as
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="700" 
                  noWrap
                  sx={{ 
                    color: '#1a5d1a',
                    fontSize: '0.95rem'
                  }}
                >
                  {user.displayName || user.email}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(26, 93, 26, 0.1)' }} />
              <MenuItem 
                onClick={() => handleNavigation('/profile')} 
                sx={{ 
                  py: 2, 
                  px: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(26, 93, 26, 0.05)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <AccountCircle sx={{ mr: 2, color: '#1a5d1a' }} />
                <Typography fontWeight={500}>Profile Settings</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => handleNavigation('/chat')} 
                sx={{ 
                  py: 2, 
                  px: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(26, 93, 26, 0.05)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Chat sx={{ mr: 2, color: '#1a5d1a' }} />
                <Typography fontWeight={500}>Chat</Typography>
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(26, 93, 26, 0.1)' }} />
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  py: 2, 
                  px: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.05)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Logout sx={{ mr: 2, color: '#ef4444' }} />
                <Typography fontWeight={500} color="#ef4444">Sign Out</Typography>
              </MenuItem>
            </Menu>

            {/* Mobile User Menu */}
            <Menu
              id="mobile-menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                display: { xs: 'block', md: 'none' },
                mt: 1.5,
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  minWidth: 200,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%)' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Signed in as
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="700" 
                  noWrap
                  sx={{ 
                    color: '#1a5d1a',
                    fontSize: '0.85rem'
                  }}
                >
                  {user.displayName || user.email}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(26, 93, 26, 0.1)' }} />
              <MenuItem 
                onClick={() => handleNavigation('/profile')} 
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(26, 93, 26, 0.05)'
                  }
                }}
              >
                <AccountCircle sx={{ mr: 1.5, color: '#1a5d1a', fontSize: 20 }} />
                <Typography fontWeight={500} fontSize="0.9rem">Profile</Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.05)'
                  }
                }}
              >
                <Logout sx={{ mr: 1.5, color: '#ef4444', fontSize: 20 }} />
                <Typography fontWeight={500} color="#ef4444" fontSize="0.9rem">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 50%, #3d8b3d 100%)',
            color: 'white',
            borderRadius: 0
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToy sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" fontWeight="700">
                HannaAI
              </Typography>
            </Box>
            <IconButton
              onClick={toggleMobileMenu}
              sx={{ 
                color: 'white', 
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* User Info in Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user.photoURL ? (
              <Avatar 
                src={user.photoURL} 
                alt="Profile"
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: '2px solid rgba(255,255,255,0.3)'
                }} 
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </Avatar>
            )}
            <Box>
              <Typography variant="body1" fontWeight="600" noWrap>
                {user.displayName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <List sx={{ flex: 1 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation('/chat')}
              selected={pathname === '/chat'}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 48 }}>
                <Chat />
              </ListItemIcon>
              <ListItemText 
                primary="Chat" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation('/profile')}
              selected={pathname === '/profile'}
              sx={{
                py: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 48 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>

          {/* Mobile Status Info */}
          {userProfile?.googleDriveFolderId && (
            <ListItem sx={{ px: 3, py: 1 }}>
              <Chip
                label="Drive Connected"
                size="small"
                sx={{ 
                  bgcolor: 'rgba(173, 216, 230, 0.9)', 
                  color: '#1e3a8a',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              py: 2,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: 48 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Sign Out" 
              primaryTypographyProps={{ fontWeight: 600, color: '#ef4444' }}
            />
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation; 