'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { FlashOn, DirectionsRun, Groups } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: { xs: '90vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(30,136,229,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255,109,0,0.1) 0%, transparent 50%), #0A0A0A',
        position: 'relative',
        overflow: 'hidden',
        pb: { xs: 10, md: 0 },
      }}
    >
      {/* Decorative glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,109,0,0.06) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(255,109,0,0.1)',
              border: '1px solid rgba(255,109,0,0.2)',
              borderRadius: 6,
              px: 2.5,
              py: 0.8,
              mb: 4,
            }}
          >
            <FlashOn sx={{ color: 'secondary.main', fontSize: 18, mr: 0.5 }} />
            <Typography variant="caption" color="secondary.main" fontWeight={600}>
              YOUR FITNESS JOURNEY STARTS HERE
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Ignite Your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF6D00 0%, #FF9100 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fitness
            </Box>
            <br />
            With{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Community Power
            </Box>
          </Typography>

            <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 620, mx: 'auto', mb: { xs: 4, md: 5 }, fontWeight: 400, lineHeight: 1.6, fontSize: { xs: '0.95rem', md: '1.25rem' }, px: { xs: 1, md: 0 } }}
          >
            Share fitness thoughts, monitor your workouts, track every run & walk,
            and connect with communities that push you forward.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => router.push('/register')}
              sx={{ px: { xs: 4, md: 5 }, py: 1.5, fontSize: '1.05rem', minHeight: 48 }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/feed')}
              sx={{
                px: { xs: 4, md: 5 },
                py: 1.5,
                fontSize: '1.05rem',
                minHeight: 48,
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'text.primary',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Explore Feed
            </Button>
          </Stack>

          {/* Stats */}
          <Stack
            direction="row"
            spacing={{ xs: 3, md: 6 }}
            justifyContent="center"
            sx={{ mt: { xs: 5, md: 8 }, opacity: 0.7 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <DirectionsRun sx={{ color: 'secondary.main', fontSize: { xs: 22, md: 28 } }} />
              <Typography variant="h6" fontWeight={700} fontSize={{ xs: '1rem', md: '1.25rem' }}>10K+</Typography>
              <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.6rem', md: '0.75rem' }}>Active Members</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Groups sx={{ color: 'primary.main', fontSize: { xs: 22, md: 28 } }} />
              <Typography variant="h6" fontWeight={700} fontSize={{ xs: '1rem', md: '1.25rem' }}>500+</Typography>
              <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.6rem', md: '0.75rem' }}>Communities</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <FlashOn sx={{ color: 'secondary.main', fontSize: { xs: 22, md: 28 } }} />
              <Typography variant="h6" fontWeight={700} fontSize={{ xs: '1rem', md: '1.25rem' }}>1M+</Typography>
              <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.6rem', md: '0.75rem' }}>Workouts Logged</Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
