'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, displayName);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    loading,
    error,
    handleSignIn,
    handleSignUp,
    handleGoogleSignIn,
    handlePasswordReset,
    clearError,
  };
};
