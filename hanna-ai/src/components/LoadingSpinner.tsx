'use client';

import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  thickness?: number;
  sx?: object;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary',
  thickness = 3.6,
  sx = {}
}) => {
  const sizePx = {
    small: 24,
    medium: 40,
    large: 56
  };

  return (
    <Box sx={{ display: 'inline-flex', ...sx }}>
      <CircularProgress 
        size={sizePx[size]} 
        color={color} 
        thickness={thickness}
      />
    </Box>
  );
};

export default LoadingSpinner;
