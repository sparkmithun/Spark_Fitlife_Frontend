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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
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
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, initialize } = useAuthStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleNavigation = (path) => {
    router.push(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    router.push('/');
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 4 }}
            onClick={() => handleNavigation('/')}
          >
            <FlashOn sx={{ color: 'secondary.main', fontSize: 32, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FF6D00 0%, #1E88E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Spark FitLife
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: pathname === item.path ? 'primary.main' : 'text.secondary',
                    '&:hover': { color: 'primary.light' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto' }}>
            {user ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
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
                    sx: { bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.06)' },
                  }}
                >
                  <MenuItem onClick={() => { handleNavigation('/profile'); setAnchorEl(null); }}>
                    <Person sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" startIcon={<Login />} onClick={() => handleNavigation('/login')}>
                  Login
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleNavigation('/register')}>
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, bgcolor: 'background.default', height: '100%', pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
            <FlashOn sx={{ color: 'secondary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Spark FitLife
            </Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={pathname === item.path}
                >
                  <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
