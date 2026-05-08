'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, FlashOn } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      router.push('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
        background:
          'radial-gradient(ellipse at 30% 50%, rgba(30,136,229,0.1) 0%, transparent 50%), #0A0A0A',
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Card sx={{ p: { xs: 1, sm: 2 } }}>
          <CardContent sx={{ px: { xs: 1.5, sm: 3 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
              <FlashOn sx={{ color: 'secondary.main', fontSize: { xs: 40, md: 48 }, mb: 1 }} />
              <Typography variant="h5" fontWeight={700}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your Spark FitLife account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                sx={{ mb: 2.5 }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 2, minHeight: 48 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                sx={{ color: 'secondary.main', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
