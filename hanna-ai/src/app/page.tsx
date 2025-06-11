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

// Lazy load the auth form
const AuthForm = lazy(() => import("./AuthForm"));

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
          background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 50%, #3d8b3d 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 80px 80px',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            animation: 'float 15s ease-in-out infinite reverse'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            animation: 'float 18s ease-in-out infinite'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <Box
              sx={{
                mb: 4,
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.02em'
                }}
              >
                Sustainable Buildings,{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#90EE90',
                    background: 'linear-gradient(45deg, #90EE90, #98FB98)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Simplified
                </Box>
              </Typography>
            </Box>
            
            <Box
              sx={{
                mb: 5,
                animation: 'fadeInUp 1s ease-out 0.2s both'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3, 
                  opacity: 0.95,
                  lineHeight: 1.5,
                  fontWeight: 300,
                  maxWidth: 700,
                  mx: 'auto',
                  fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' }
                }}
              >
                Meet HannaAI - your intelligent sustainability assistant that helps you navigate 
                complex environmental regulations and achieve your green building goals.
              </Typography>
            </Box>
            
            <Box
              sx={{
                animation: 'fadeInUp 1s ease-out 0.4s both'
              }}
            >
              <Button 
                variant="contained"
                size="large"
                onClick={() => setShowAuthForm(true)}
                sx={{ 
                  bgcolor: 'white',
                  color: '#1a5d1a',
                  px: 6,
                  py: 3,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  border: '2px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(-2px) scale(1.01)'
                  }
                }}
              >
                Get Started →
              </Button>
            </Box>

            {/* Key features */}
            <Box
              sx={{
                mt: 8,
                pt: 4,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: 4,
                  flexWrap: 'wrap',
                  opacity: 0.6
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                  Real Estate Compliance
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                  Data-Driven Insights
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                  Sustainability Focus
                </Typography>
              </Box>
            </Box>
            
          </Box>
        </Container>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
          }
        `}</style>
      </Box>
    </Box>
  );
}
