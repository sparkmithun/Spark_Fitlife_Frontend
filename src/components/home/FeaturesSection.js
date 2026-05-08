'use client';

import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Forum,
  FitnessCenter,
  DirectionsRun,
  Groups,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';

const features = [
  {
    icon: <Forum sx={{ fontSize: 40 }} />,
    title: 'Share Fitness Thoughts',
    description: 'Post tips, progress updates, motivation quotes, and questions to the community.',
    color: '#1E88E5',
  },
  {
    icon: <FitnessCenter sx={{ fontSize: 40 }} />,
    title: 'Track Workouts',
    description: 'Log every gym session, yoga class, or HIIT workout with detailed exercise tracking.',
    color: '#FF6D00',
  },
  {
    icon: <DirectionsRun sx={{ fontSize: 40 }} />,
    title: 'Monitor Runs & Walks',
    description: 'Record distance, duration, and calories for all your cardio activities.',
    color: '#1E88E5',
  },
  {
    icon: <Groups sx={{ fontSize: 40 }} />,
    title: 'Join Communities',
    description: 'Create or join groups focused on running, weightlifting, yoga, cycling, and more.',
    color: '#FF6D00',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    title: 'Progress Analytics',
    description: 'Visualise your weekly stats, calorie burn trends, and workout consistency.',
    color: '#1E88E5',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    title: 'Stay Motivated',
    description: 'Get inspired by community progress, earn streaks, and celebrate milestones.',
    color: '#FF6D00',
  },
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={700}
          sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2.5rem' } }}
        >
          Everything You Need to{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>
            Stay Fit
          </Box>
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', mb: { xs: 4, md: 8 }, fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          Spark FitLife gives you the tools to track, share, and grow your fitness journey alongside a
          supportive community.
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {features.map((feature, index) => (
            <Grid item xs={6} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, border-color 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Box
                    sx={{
                      width: { xs: 48, md: 64 },
                      height: { xs: 48, md: 64 },
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      mb: { xs: 1.5, md: 2 },
                      '& svg': { fontSize: { xs: 28, md: 40 } },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="body1" fontWeight={600} gutterBottom fontSize={{ xs: '0.85rem', md: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', md: '0.875rem' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
