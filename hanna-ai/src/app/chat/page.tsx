"use client";

import { useAuth } from '../../contexts/AuthContext';
import CustomChatInterface from '../../components/CustomChatInterface';
import Navigation from '../../components/Navigation';
import { 
  Box, 
  CircularProgress, 
  Typography,
  Container,
  Alert,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { user, loading, userProfile } = useAuth();
  const router = useRouter();

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#2e7d2e' }} />
        <Typography variant="h6" color="text.secondary">
          Initializing application...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Authentication Required
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Please sign in to access the AI assistant.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
            sx={{
              background: 'linear-gradient(45deg, #1a5d1a 30%, #2e7d2e 90%)',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #0f3a0f 30%, #1a5d1a 90%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(26, 93, 26, 0.3)'
              }
            }}
          >
            Sign In
          </Button>
        </Alert>
      </Container>
    );
  }

  // No agent ID configured
  if (!userProfile?.chatbaseAgentId) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navigation />
        <Container maxWidth="sm" sx={{ mt: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 3,
              p: 4,
              boxShadow: '0 8px 32px rgba(26, 93, 26, 0.15)'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1a5d1a' }}>
              Configuration Required
            </Typography>
            <Typography sx={{ mb: 3, lineHeight: 1.6 }}>
              You need to configure your Chatbase Agent ID before you can use the AI assistant. 
              This connects the chat interface to your personal AI agent.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/profile')}
              sx={{
                background: 'linear-gradient(45deg, #1a5d1a 30%, #2e7d2e 90%)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0f3a0f 30%, #1a5d1a 90%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(26, 93, 26, 0.4)'
                }
              }}
            >
              Set Up Agent ID in Profile
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

     return (
     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
       <Navigation />
       <Box sx={{ flex: 1, overflow: 'hidden' }}>
         <CustomChatInterface 
           chatbotId={userProfile.chatbaseAgentId}
           title="Hanna AI"
           subtitle="Building Performance & Compliance Analysis"
         />
       </Box>
     </Box>
   );
} 