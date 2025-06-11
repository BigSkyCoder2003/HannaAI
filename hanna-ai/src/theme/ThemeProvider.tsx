'use client';

import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

// Create a custom theme inspired by GreenT Climate
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a5d1a',     // Deep green similar to GreenT
      light: '#2e7d2e',    // Lighter green
      dark: '#0f3d0f',     // Darker green
    },
    secondary: {
      main: '#2e7d2e',     // Medium green
      light: '#4caf50',    // Light green
      dark: '#1a5d1a',     // Deep green
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c2c2c',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(26, 93, 26, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a5d1a 0%, #2e7d2e 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f3d0f 0%, #1a5d1a 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#1a5d1a',
          color: '#1a5d1a',
          borderWidth: '2px',
          '&:hover': {
            borderColor: '#0f3d0f',
            backgroundColor: 'rgba(26, 93, 26, 0.04)',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2e7d2e',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a5d1a',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
