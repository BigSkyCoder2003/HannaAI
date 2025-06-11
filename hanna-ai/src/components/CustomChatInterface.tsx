"use client";

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  useTheme
} from '@mui/material';
import { 
  BusinessCenter as BusinessIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface CustomChatInterfaceProps {
  chatbotId?: string;
  title?: string;
  subtitle?: string;
}

const CustomChatInterface: React.FC<CustomChatInterfaceProps> = ({ 
  chatbotId = "dTtIEntOlNsbMbAc9q67-", // Default from env
  title = "AI Assistant",
  subtitle = "Property Management & Compliance Intelligence"
}) => {
  const theme = useTheme();
  const { user, userProfile } = useAuth();

  // Use agent ID from user profile if available
  const agentId = userProfile?.chatbaseAgentId || chatbotId;

  return (
    <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
      {/* Header */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          mb: 1, 
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          borderRadius: 0,
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <BusinessIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 400 }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Iframe Container - Takes all remaining space */}
      <Paper 
        elevation={1} 
        sx={{ 
          flex: 1, 
          minHeight: 0,
          borderRadius: 0,
          overflow: 'hidden',
          position: 'relative',
          background: '#ffffff',
          border: '1px solid #e1e5e9'
        }}
      >
        {/* Loading overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            zIndex: 1,
            '& iframe': {
              opacity: 0,
              transition: 'opacity 0.5s ease-in-out'
            },
            '& iframe[data-loaded="true"]': {
              opacity: 1
            }
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Loading assistant...
          </Typography>
        </Box>

        {/* Chatbase Iframe */}
        <iframe
          src={`https://www.chatbase.co/chatbot-iframe/${agentId}`}
          width="100%"
          height="100%"
          style={{ 
            border: 'none',
            background: 'transparent',
            position: 'relative',
            zIndex: 2,
            borderRadius: '0px'
          }}
          title="AI Assistant Interface"
          onLoad={(e) => {
            // Hide loading overlay when iframe loads
            const iframe = e.target as HTMLIFrameElement;
            iframe.setAttribute('data-loaded', 'true');
            const loadingOverlay = iframe.parentElement?.querySelector('div');
            if (loadingOverlay) {
              loadingOverlay.style.display = 'none';
            }
          }}
        />
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 1, textAlign: 'center', flexShrink: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Agent ID: {agentId}
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomChatInterface; 