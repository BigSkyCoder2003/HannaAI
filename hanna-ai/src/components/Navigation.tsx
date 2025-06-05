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
  Divider
} from '@mui/material';
import {
  SmartToy,
  Settings,
  Logout,
  Chat,
  AccountCircle,
  Home
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <SmartToy sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" component="div" fontWeight="700">
            HannaAI
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Button
            color="inherit"
            startIcon={<Chat />}
            onClick={() => handleNavigation('/chat')}
            variant={pathname === '/chat' ? 'outlined' : 'text'}
            sx={{ 
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: pathname === '/chat' ? 600 : 400,
              bgcolor: pathname === '/chat' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Chat
          </Button>
          <Button
            color="inherit"
            startIcon={<Settings />}
            onClick={() => handleNavigation('/profile')}
            variant={pathname === '/profile' ? 'outlined' : 'text'}
            sx={{ 
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: pathname === '/profile' ? 600 : 400,
              bgcolor: pathname === '/profile' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Profile
          </Button>
        </Box>

        {/* Status Chips */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 3 }}>
          {userProfile?.chatbaseAgentId && (
            <Chip
              label="Agent Connected"
              color="success"
              size="small"
              variant="filled"
              sx={{ 
                bgcolor: 'success.main', 
                color: 'white',
                fontWeight: 500
              }}
            />
          )}
          {userProfile?.googleDriveFolderId && (
            <Chip
              label="Drive Linked"
              color="info"
              size="small"
              variant="filled"
              sx={{ 
                bgcolor: 'info.main', 
                color: 'white',
                fontWeight: 500
              }}
            />
          )}
        </Box>

        {/* Quick Logout Button */}
        <Button
          color="inherit"
          startIcon={<Logout />}
          onClick={handleLogout}
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.5)',
            mr: 2,
            px: 2,
            py: 0.5,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Sign Out
        </Button>

        {/* User Menu */}
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
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                border: '2px solid rgba(255,255,255,0.7)'
              }
            }}
          >
            {user.photoURL ? (
              <Avatar 
                src={user.photoURL} 
                alt="Profile"
                sx={{ width: 36, height: 36 }} 
              />
            ) : (
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </Avatar>
            )}
          </IconButton>
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
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Signed in as
              </Typography>
              <Typography variant="body2" fontWeight="600" noWrap>
                {user.displayName || user.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleNavigation('/profile')} sx={{ py: 1.5 }}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile Settings
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/chat')} sx={{ py: 1.5 }}>
              <Chat sx={{ mr: 2 }} />
              Chat
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <Logout sx={{ mr: 2 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 