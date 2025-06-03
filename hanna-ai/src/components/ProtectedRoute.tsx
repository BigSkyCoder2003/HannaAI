'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../app/AuthForm';
import LoadingSpinner from './LoadingSpinner';
import { Box, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <AuthForm /> 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh' 
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LoadingSpinner size="large" />
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mt: 3 }}
          >
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
