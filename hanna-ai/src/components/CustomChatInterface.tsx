"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  useTheme,
  CircularProgress,
  Fade,
  Alert,
  Button
} from '@mui/material';
import { 
  SmartToy as AIIcon,
  CheckCircle as CheckIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Use agent ID from user profile if available
  const agentId = userProfile?.chatbaseAgentId || chatbotId;

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Check the chatbase URL when agent ID changes
  useEffect(() => {
    const checkUrl = async () => {
      if (!agentId || isLoading) return;
      
      setIsChecking(true);
      setHasError(false);
      setIframeLoaded(false);
      
      try {
        // Use our own API to check the chatbase URL (bypasses CORS)
        const response = await fetch('/api/check-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentId: agentId
          }),
        });
        
        const result = await response.json();
        
        if (!response.ok || result.isValid === false) {
          console.log('Agent ID check failed:', result.error || 'Unknown error');
          setHasError(true);
          setIsChecking(false);
          return;
        }
        
        console.log('Agent ID check passed - proceeding with iframe load');
        setIsChecking(false);
        
      } catch (error) {
        // API error - fall back to iframe loading with timing detection
        console.log('Agent check API failed, falling back to timing detection:', error);
        setIsChecking(false);
      }
    };

    checkUrl();
  }, [agentId, isLoading]);

  const handleIframeLoad = () => {
    // Track load time for timing-based 404 detection (fallback)
    const loadStart = Date.now();
    
    setTimeout(() => {
      const loadTime = Date.now() - loadStart;
      
      // If iframe loaded suspiciously fast (under 1.5 seconds), might be a 404
      if (loadTime < 1500) {
        console.log(`Iframe loaded very quickly (${loadTime}ms) - might be a 404`);
        setHasError(true);
      } else {
        setIframeLoaded(true);
      }
    }, 2000); // Wait 2 seconds to measure timing
  };

  const handleIframeError = () => {
    console.log('Iframe loading error detected');
    setHasError(true);
    setIframeLoaded(false);
  };

  // Backup timeout
  useEffect(() => {
    if (!isLoading && !isChecking && !iframeLoaded && !hasError) {
      const timeout = setTimeout(() => {
        console.log('Backup timeout - assuming invalid agent ID');
        setHasError(true);
      }, 5000); // Shorter timeout since we pre-checked

      return () => clearTimeout(timeout);
    }
  }, [isLoading, isChecking, iframeLoaded, hasError]);

  // Error state - invalid agent ID
  if (hasError) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f4 100%)',
          py: 3
        }}
      >
        <Container maxWidth="lg" sx={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 3, 
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
              color: 'white',
              borderRadius: 4,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)'
            }}
          >
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
                <SettingsIcon sx={{ fontSize: 32, color: 'white' }} />
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
                  Invalid Agent Configuration
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9, 
                    fontWeight: 300,
                    fontSize: '1.1rem'
                  }}
                >
                  Unable to connect to your AI agent
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Error Message */}
          <Fade in={true} timeout={600}>
            <Paper 
              elevation={0} 
              sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                p: 4
              }}
            >
              <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 3,
                    p: 4,
                    boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)',
                    mb: 3
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#dc2626' }}>
                    Agent ID Invalid
                  </Typography>
                  <Typography sx={{ mb: 3, lineHeight: 1.6 }}>
                    The Chatbase Agent ID "<strong>{agentId}</strong>" appears to be invalid or the agent is not accessible. 
                    Please verify your agent ID in your Chatbase dashboard and ensure the agent is published.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<SettingsIcon />}
                      onClick={() => router.push('/profile')}
                      sx={{
                        background: 'linear-gradient(45deg, #dc2626 30%, #ef4444 90%)',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #b91c1c 30%, #dc2626 90%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
                        }
                      }}
                    >
                      Update Agent ID
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => {
                        setHasError(false);
                        setIframeLoaded(false);
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 800);
                      }}
                      sx={{
                        borderColor: '#dc2626',
                        color: '#dc2626',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#b91c1c',
                          color: '#b91c1c',
                          bgcolor: 'rgba(220, 38, 38, 0.05)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      Try Again
                    </Button>
                  </Box>
                </Alert>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Need help? Make sure your Chatbase agent is published and the ID is correct.
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

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
                <CheckIcon sx={{ fontSize: 20, color: '#90EE90' }} />
                                  <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {isChecking ? 'Checking...' : iframeLoaded ? 'Connected' : 'Connecting...'}
                  </Typography>
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
            {(!iframeLoaded || isChecking) && !hasError && (
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
                  {isChecking ? 'Checking Agent ID...' : 'Initializing AI Assistant...'}
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
            {!isChecking && !hasError && (
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
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            )}
          </Paper>
        </Fade>

        {/* Modern Footer */}
        <Fade in={!isLoading && iframeLoaded && !hasError && !isChecking} timeout={600} style={{ transitionDelay: '400ms' }}>
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