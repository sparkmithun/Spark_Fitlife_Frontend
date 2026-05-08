'use client';

import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { FlashOn, GitHub, Twitter } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FlashOn sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={800}>
                Spark FitLife
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Your fitness community platform. Share, track, and grow together.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Platform
            </Typography>
            <Link href="/feed" color="text.secondary" display="block" underline="hover" sx={{ mb: 0.5 }}>
              Feed
            </Link>
            <Link href="/workouts" color="text.secondary" display="block" underline="hover" sx={{ mb: 0.5 }}>
              Workouts
            </Link>
            <Link href="/communities" color="text.secondary" display="block" underline="hover">
              Communities
            </Link>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Link href="#" color="text.secondary" display="block" underline="hover" sx={{ mb: 0.5 }}>
              About
            </Link>
            <Link href="#" color="text.secondary" display="block" underline="hover" sx={{ mb: 0.5 }}>
              Privacy
            </Link>
            <Link href="#" color="text.secondary" display="block" underline="hover">
              Terms
            </Link>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <GitHub />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Twitter />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
          © {new Date().getFullYear()} Spark FitLife. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
