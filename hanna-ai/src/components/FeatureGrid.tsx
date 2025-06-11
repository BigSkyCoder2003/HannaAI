'use client';

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Fade,
  Box
} from '@mui/material';
import {
  Nature as EcoIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const features = [
  {
    icon: <ChatIcon />,
    title: "Intelligent Conversations",
    description: "Advanced AI-powered chat that understands context and provides actionable sustainability insights."
  },
  {
    icon: <EcoIcon />,
    title: "Sustainability Expertise",
    description: "Specialized knowledge in green building standards, environmental compliance, and carbon reduction strategies."
  },
  {
    icon: <SpeedIcon />,
    title: "Real-time Responses",
    description: "Get instant answers to complex sustainability questions with our high-performance AI engine."
  },
  {
    icon: <SecurityIcon />,
    title: "Secure & Private",
    description: "Enterprise-grade security ensures your conversations and data remain completely confidential."
  },
  {
    icon: <TrendingUpIcon />,
    title: "Continuous Learning",
    description: "Our AI continuously updates with the latest sustainability practices and regulatory changes."
  },
  {
    icon: <BotIcon />,
    title: "24/7 Availability",
    description: "Access expert sustainability guidance anytime, anywhere, without waiting for human consultants."
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2, color: '#1a5d1a' }}>
          Why Choose HannaAI?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Advanced AI technology meets sustainability expertise to deliver unparalleled 
          support for your environmental initiatives.
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 4
        }}
      >
        {features.map((feature, index) => (
          <Fade in={true} timeout={600 + (index * 100)} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 40px rgba(26, 93, 26, 0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#1a5d1a',
                    width: 56,
                    height: 56,
                    mb: 3
                  }}
                >
                  {feature.icon}
                </Avatar>
                
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  {feature.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>
    </Container>
  );
};

export default FeatureGrid; 