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
  Link
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
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        py: 6,
        px: 2
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'primary.main',
              background: 'linear-gradient(45deg, #3f51b5 30%, #536dfe 90%)'
            }}
          >
            {isSignUp ? <PersonAdd sx={{ fontSize: 32 }} /> : <Lock sx={{ fontSize: 32 }} />}
          </Avatar>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSignUp ? 'Join us and start your journey' : 'Sign in to your account'}
          </Typography>
        </Box>

        {/* Main Form Container */}
        <Card 
          elevation={8} 
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #3f51b5, #536dfe)'
            }}
          />
          
          <CardContent sx={{ p: 4 }}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {resetEmailSent && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Password reset email sent! Check your inbox.
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
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
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: 'text.secondary' }}>
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
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>
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
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>
                        <Lock />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
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
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #536dfe 90%)',
                    boxShadow: '0 3px 10px rgba(63, 81, 181, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                      boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)',
                    }
                  }}
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary">
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
                py: 1.5,
                borderRadius: 2,
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: 'grey.50'
                }
              }}
            >
              Continue with Google
            </Button>

            {/* Toggle between sign in and sign up */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                component="button"
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                variant="body2"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
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
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            By signing {isSignUp ? 'up' : 'in'}, you agree to our{' '}
            <Link href="#" underline="hover">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" underline="hover">Privacy Policy</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;