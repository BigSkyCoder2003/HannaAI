'use client';

import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import UserProfile from '../../components/UserProfile';
import { Container, Typography, Box } from '@mui/material';

export default function ProfilePage() {
  return (
    <ProtectedRoute fallback={
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Please sign in to access your profile
        </Typography>
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