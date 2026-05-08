'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E88E5',      // Blue
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6D00',      // Orange
      light: '#FF9100',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0A0A',   // Deep black
      paper: '#141414',     // Slightly lighter black
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    divider: 'rgba(255,255,255,0.08)',
    action: {
      hover: 'rgba(30,136,229,0.08)',
      selected: 'rgba(30,136,229,0.14)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF6D00 0%, #E65100 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF9100 0%, #FF6D00 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
          '& .MuiInputBase-input': {
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'plaintext',
          },
        },
      },
    },
  },
});

export default theme;
