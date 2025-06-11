"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  useTheme,
  CircularProgress,
  Fade
} from '@mui/material';
import { 
  SmartToy as AIIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface CustomChatInterfaceProps {
  chatbotId?: string;
  title?: string;
  subtitle?: string;
}

const CustomChatInterface: React.FC<CustomChatInterfaceProps> = ({ 
  chatbotId = "dTtIEntOlNsbMbAc9q67-", // Default from env
  title = "HannaAI Assistant",
  subtitle = "Your intelligent sustainability assistant"
}) => {
  const theme = useTheme();
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Use agent ID from user profile if available
  const agentId = userProfile?.chatbaseAgentId || chatbotId;

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%)',
        py: 3
      }}
    >
      <Container maxWidth="lg" sx={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
        {/* Modern Header */}
        <Fade in={!isLoading} timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 3, 
              background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 50%, #3d8b3d 100%)',
              color: 'white',
              borderRadius: 4,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(26, 93, 26, 0.2)'
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
                  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px, 80px 80px'
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                <AIIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  sx={{ 
                    letterSpacing: '-0.01em',
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9, 
                    fontWeight: 300,
                    fontSize: '1.1rem'
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Chat Interface Container */}
        <Fade in={!isLoading} timeout={800} style={{ transitionDelay: '200ms' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              flex: 1, 
              minHeight: 0,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
            }}
          >
            {/* Loading overlay */}
            {!iframeLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CircularProgress 
                  sx={{ 
                    color: '#1a5d1a',
                    mb: 2
                  }} 
                  size={48}
                />
                <Typography 
                  color="#1a5d1a" 
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    textAlign: 'center'
                  }}
                >
                  Initializing AI Assistant...
                </Typography>
                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '0.85rem',
                    mt: 1,
                    opacity: 0.7
                  }}
                >
                  This may take a moment
                </Typography>
              </Box>
            )}

            {/* Chatbase Iframe */}
            <iframe
              src={`https://www.chatbase.co/chatbot-iframe/${agentId}`}
              width="100%"
              height="100%"
              style={{ 
                border: 'none',
                background: 'transparent',
                borderRadius: '16px',
                opacity: iframeLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
              title="HannaAI Assistant Interface"
              onLoad={() => {
                // Small delay to ensure content is rendered
                setTimeout(() => {
                  setIframeLoaded(true);
                }, 500);
              }}
            />
          </Paper>
        </Fade>

        {/* Modern Footer */}
        <Fade in={!isLoading && iframeLoaded} timeout={600} style={{ transitionDelay: '400ms' }}>
          <Box sx={{ mt: 3, textAlign: 'center', flexShrink: 0 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#1a5d1a',
                  fontWeight: 500,
                  fontSize: '0.8rem'
                }}
              >
                Agent ID: {agentId}
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default CustomChatInterface; 