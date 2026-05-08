'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home,
  FitnessCenter,
  Groups,
  Person,
  Logout,
  Login,
  FlashOn,
} from '@mui/icons-material';
import useAuthStore from '@/store/authStore';

const navItems = [
  { label: 'Feed', path: '/feed', icon: <Home /> },
  { label: 'Workouts', path: '/workouts', icon: <FitnessCenter /> },
  { label: 'Communities', path: '/communities', icon: <Groups /> },
  { label: 'Profile', path: '/profile', icon: <Person /> },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, initialize } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    router.push('/');
  };

  const currentNav = navItems.findIndex((item) => pathname.startsWith(item.path));

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 1.5, md: 3 } }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleNavigation('/')}
          >
            <FlashOn sx={{ color: 'secondary.main', fontSize: { xs: 26, md: 32 }, mr: 0.5 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                background: 'linear-gradient(135deg, #FF6D00 0%, #1E88E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Spark FitLife
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 4, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: pathname.startsWith(item.path) ? 'primary.main' : 'text.secondary',
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side */}
          <Box sx={{ ml: 'auto' }}>
            {user ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{ width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 }, bgcolor: 'primary.main' }}
                    src={user.avatar}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: { bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.06)', minWidth: 160 },
                  }}
                >
                  {!isMobile && (
                    <MenuItem onClick={() => { handleNavigation('/profile'); setAnchorEl(null); }}>
                      <Person sx={{ mr: 1, fontSize: 20 }} /> Profile
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1, fontSize: 20 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
                <Button
                  color="inherit"
                  size={isMobile ? 'small' : 'medium'}
                  startIcon={!isMobile ? <Login /> : undefined}
                  onClick={() => handleNavigation('/login')}
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  onClick={() => handleNavigation('/register')}
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Bottom Navigation */}
      {isMobile && user && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            bgcolor: 'rgba(10,10,10,0.95)',
            backdropFilter: 'blur(12px)',
            pb: 'env(safe-area-inset-bottom)',
          }}
          elevation={8}
        >
          <BottomNavigation
            value={currentNav}
            onChange={(e, newValue) => handleNavigation(navItems[newValue].path)}
            sx={{
              bgcolor: 'transparent',
              height: 60,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                minWidth: 0,
                padding: '6px 0',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                mt: 0.3,
                '&.Mui-selected': {
                  fontSize: '0.65rem',
                },
              },
            }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}
