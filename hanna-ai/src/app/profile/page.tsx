'use client';

import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import UserProfile from '../../components/UserProfile';
import { Container, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <ProtectedRoute fallback={
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to access your profile
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
          sx={{
            background: 'linear-gradient(45deg, #1a5d1a 30%, #2e7d2e 90%)',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(45deg, #0f3a0f 30%, #1a5d1a 90%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(26, 93, 26, 0.3)'
            }
          }}
        >
          Sign In
        </Button>
      </Container>
    }>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navigation />
        <Box sx={{ flex: 1 }}>
          <UserProfile />
        </Box>
      </Box>
    </ProtectedRoute>
  );
} 