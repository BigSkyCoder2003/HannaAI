'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Stack, 
  Divider
} from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maxWidth: 500
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3f51b5, #536dfe)'
        }}
      />
      
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
          {user.photoURL ? (
            <Avatar 
              src={user.photoURL} 
              alt="Profile"
              sx={{ width: 70, height: 70 }} 
            />
          ) : (
            <Avatar
              sx={{ 
                width: 70, 
                height: 70,
                bgcolor: 'primary.main' 
              }}
            >
              {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
            </Avatar>
          )}
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {user.displayName || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Account created: {user.metadata.creationTime}
            </Typography>
          </Box>
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutOutlined />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Sign Out
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
