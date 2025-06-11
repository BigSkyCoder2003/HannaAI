'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Link,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  Lock,
  Google,
  Email,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

interface AuthFormProps {
  mode?: 'signin' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode = 'signin' }) => {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 50%, #3d8b3d 100%)',
        py: 6,
        px: 2,
        position: 'relative',
        overflow: 'hidden'
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
          opacity: 0.08,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 100px 100px',
          animation: 'float 25s ease-in-out infinite'
        }}
      />
      
      {/* Floating shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          animation: 'float 20s ease-in-out infinite reverse'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          animation: 'float 22s ease-in-out infinite'
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            animation: 'fadeInDown 0.8s ease-out'
          }}
        >
          <Avatar 
            sx={{ 
              width: 72, 
              height: 72, 
              mx: 'auto', 
              mb: 3,
              bgcolor: 'rgba(255,255,255,0.1)',
              background: 'linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            {isSignUp ? <PersonAdd sx={{ fontSize: 36, color: 'white' }} /> : <Lock sx={{ fontSize: 36, color: 'white' }} />}
          </Avatar>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom 
            sx={{ 
              color: 'white',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '-0.01em'
            }}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 300,
              fontSize: '1.1rem'
            }}
          >
            {isSignUp ? 'Join us and start your sustainability journey' : 'Sign in to continue to HannaAI'}
          </Typography>
        </Box>

        {/* Main Form Container */}
        <Box
          sx={{
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}
        >
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 6,
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1a5d1a, #2e7d2e, #3d8b3d)'
              }}
            />
            
            <CardContent sx={{ p: 5 }}>
              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    animation: 'shake 0.5s ease-in-out'
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Success Alert */}
              {resetEmailSent && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}
                >
                  Password reset email sent! Check your inbox.
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  {/* Display Name Field (only for sign up) */}
                  {isSignUp && (
                    <TextField
                      fullWidth
                      label="Display Name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required={isSignUp}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(26, 93, 26, 0.15)'
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(26, 93, 26, 0.25)'
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: '#1a5d1a' }}>
                            <PersonAdd />
                          </Box>
                        ),
                      }}
                    />
                  )}

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(26, 93, 26, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(26, 93, 26, 0.25)'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: '#1a5d1a' }}>
                          <Email />
                        </Box>
                      ),
                    }}
                  />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    inputProps={{ minLength: 6 }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(26, 93, 26, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(26, 93, 26, 0.25)'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: '#1a5d1a' }}>
                          <Lock />
                        </Box>
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#1a5d1a' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #1a5d1a 30%, #2e7d2e 90%)',
                      boxShadow: '0 6px 20px rgba(26, 93, 26, 0.3)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0f3a0f 30%, #1a5d1a 90%)',
                        boxShadow: '0 8px 25px rgba(26, 93, 26, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(45deg, #888 30%, #aaa 90%)',
                        transform: 'none'
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Processing...
                      </Box>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>

              {/* Divider */}
              <Box sx={{ my: 4 }}>
                <Divider>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      px: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    Or continue with
                  </Typography>
                </Divider>
              </Box>

              {/* Google Sign In */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={<Google />}
                sx={{ 
                  py: 2,
                  borderRadius: 3,
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: '1rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1a5d1a',
                    bgcolor: 'rgba(26, 93, 26, 0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Continue with Google
              </Button>

              {/* Toggle between sign in and sign up */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Link
                  component="button"
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  variant="body2"
                  sx={{ 
                    textDecoration: 'none',
                    color: '#1a5d1a',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      textDecoration: 'underline',
                      color: '#0f3a0f'
                    }
                  }}
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </Link>
              </Box>

              {/* Password reset */}
              {!isSignUp && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handlePasswordReset}
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#1a5d1a'
                      }
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 4,
            animation: 'fadeIn 1s ease-out 0.4s both'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.85rem'
            }}
          >
            By signing {isSignUp ? 'up' : 'in'}, you agree to our{' '}
            <Link 
              href="#" 
              underline="hover"
              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link 
              href="#" 
              underline="hover"
              sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              Privacy Policy
            </Link>
          </Typography>
        </Box>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(3deg);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>
      </Box>
    </Box>
  );
};

export default AuthForm;