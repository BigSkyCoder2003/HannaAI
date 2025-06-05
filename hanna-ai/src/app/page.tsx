"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import UserProfile from "../components/UserProfile";
import AuthForm from "./AuthForm";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Button
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseApp from "../firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect will happen automatically via useEffect above
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f5f7fa', 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 4 }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1"
            fontWeight="700" 
            color="text.primary" 
            sx={{ mb: 2 }}
          >
            HannaAI
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your AI-powered assistant, ready to help with anything
          </Typography>
        </Box>

        <ProtectedRoute 
          fallback={
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Typography variant="h5" color="text.secondary" textAlign="center">
                Sign in to start chatting with HannaAI
              </Typography>
              <AuthForm />
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleGoogleSignIn} 
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Continue with Google
              </Button>
            </Box>
          }
        >
          {/* This will redirect to /chat automatically via useEffect */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary">
              Redirecting to chat...
            </Typography>
          </Box>
        </ProtectedRoute>
      </Container>
    </Box>
  );
}
