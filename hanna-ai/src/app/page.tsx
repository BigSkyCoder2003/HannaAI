"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense, lazy } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress
} from "@mui/material";

// Lazy load heavy components to reduce initial bundle size
const AuthForm = lazy(() => import("./AuthForm"));
const FeatureGrid = lazy(() => import("../components/FeatureGrid"));

// Simple loading component
const PageLoader = () => (
  <Box 
    sx={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 100%)'
    }}
  >
    <Box sx={{ textAlign: 'center', color: 'white' }}>
      <CircularProgress sx={{ color: 'white', mb: 2 }} />
      <Typography variant="h6">Loading HannaAI...</Typography>
    </Box>
  </Box>
);

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  if (loading) {
    return <PageLoader />;
  }

  if (showAuthForm) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AuthForm />
      </Suspense>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ py: 12, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Sustainable Buildings,{' '}
              <Box component="span" sx={{ color: '#90EE90' }}>
                Simplified
              </Box>
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.95,
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Meet HannaAI - your intelligent sustainability assistant that helps you navigate 
              complex environmental regulations and achieve your green building goals.
            </Typography>
            
            <Button 
              variant="contained"
              size="large"
              onClick={() => setShowAuthForm(true)}
              sx={{ 
                bgcolor: 'white',
                color: '#1a5d1a',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section - Lazy loaded */}
      <Suspense fallback={
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      }>
        <FeatureGrid />
      </Suspense>
    </Box>
  );
}
