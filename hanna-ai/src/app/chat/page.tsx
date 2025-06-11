"use client";

import { useAuth } from '../../contexts/AuthContext';
import CustomChatInterface from '../../components/CustomChatInterface';
import Navigation from '../../components/Navigation';
import { 
  Box, 
  CircularProgress, 
  Typography,
  Container,
  Alert
} from '@mui/material';

export default function ChatPage() {
  const { user, loading, userProfile } = useAuth();

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
          <Typography>
            Please sign in to access the AI assistant.
          </Typography>
        </Alert>
      </Container>
    );
  }

  // No agent ID configured
  if (!userProfile?.chatbaseAgentId) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Configuration Required
          </Typography>
          <Typography>
            AI agent configuration is required. Please contact your administrator 
            or check your profile settings.
          </Typography>
        </Alert>
      </Container>
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