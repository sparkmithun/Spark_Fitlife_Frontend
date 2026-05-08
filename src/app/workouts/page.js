'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Fab,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add,
  Close,
  FitnessCenter,
  DirectionsRun,
  DirectionsWalk,
  DirectionsBike,
  Pool,
  SelfImprovement,
  LocalFireDepartment,
  Timer,
  Delete,
} from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { workoutAPI } from '@/lib/api';

const workoutTypes = [
  { value: 'run', label: 'Run', icon: <DirectionsRun /> },
  { value: 'walk', label: 'Walk', icon: <DirectionsWalk /> },
  { value: 'cycling', label: 'Cycling', icon: <DirectionsBike /> },
  { value: 'gym', label: 'Gym', icon: <FitnessCenter /> },
  { value: 'yoga', label: 'Yoga', icon: <SelfImprovement /> },
  { value: 'swimming', label: 'Swimming', icon: <Pool /> },
  { value: 'hiit', label: 'HIIT', icon: <LocalFireDepartment /> },
  { value: 'other', label: 'Other', icon: <FitnessCenter /> },
];

const typeColors = {
  run: '#FF6D00',
  walk: '#66BB6A',
  cycling: '#42A5F5',
  gym: '#1E88E5',
  yoga: '#AB47BC',
  swimming: '#26C6DA',
  hiit: '#EF5350',
  other: '#78909C',
};

export default function WorkoutsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, initialize } = useAuthStore();
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'run',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchData = useCallback(async () => {
    try {
      const params = filterType ? { type: filterType } : {};
      const [workoutsRes, statsRes] = await Promise.all([
        workoutAPI.getAll(params),
        workoutAPI.getStats(),
      ]);
      setWorkouts(workoutsRes.data || []);
      setStats(statsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    if (user) fetchData();
    else setLoading(false);
  }, [user, fetchData]);

  const handleCreate = async () => {
    try {
      await workoutAPI.create({
        ...form,
        duration: parseInt(form.duration),
        distance: parseFloat(form.distance) || 0,
        calories: parseInt(form.calories) || 0,
      });
      setDialogOpen(false);
      setForm({ title: '', type: 'run', duration: '', distance: '', calories: '', notes: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create workout');
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutAPI.remove(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete workout');
    }
  };

  const totalDuration = stats.reduce((sum, s) => sum + s.totalDuration, 0);
  const totalCalories = stats.reduce((sum, s) => sum + s.totalCalories, 0);
  const totalDistance = stats.reduce((sum, s) => sum + s.totalDistance, 0);
  const totalWorkouts = stats.reduce((sum, s) => sum + s.count, 0);

  if (!user) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <FitnessCenter sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600}>
            Sign in to track your workouts
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, md: 4 }, pt: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
            <FitnessCenter sx={{ color: 'secondary.main', verticalAlign: 'middle', mr: 0.5, fontSize: { xs: 24, md: 28 } }} />
            My Workouts
          </Typography>
          {!isMobile && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Log Workout
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 1, md: 2 }} sx={{ mb: { xs: 2, md: 4 } }}>
          {[
            { label: 'Workouts', value: totalWorkouts, icon: <FitnessCenter />, color: '#1E88E5' },
            { label: 'Duration', value: `${totalDuration}m`, icon: <Timer />, color: '#FF6D00' },
            { label: 'Calories', value: totalCalories, icon: <LocalFireDepartment />, color: '#EF5350' },
            { label: 'Distance', value: `${totalDistance.toFixed(1)}km`, icon: <DirectionsRun />, color: '#66BB6A' },
          ].map((stat, i) => (
            <Grid item xs={3} md={3} key={i}>
              <Card sx={{ textAlign: 'center', py: { xs: 1.5, md: 3 }, px: { xs: 0.5, md: 2 } }}>
                <Box sx={{ color: stat.color, mb: 0.5, '& svg': { fontSize: { xs: 20, md: 24 } } }}>{stat.icon}</Box>
                <Typography variant={isMobile ? 'body1' : 'h5'} fontWeight={700} fontSize={{ xs: '1rem', md: '1.5rem' }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.6rem', md: '0.75rem' }}>{stat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filter */}
        <Stack direction="row" spacing={1} sx={{ mb: { xs: 2, md: 3 }, flexWrap: 'nowrap', overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip
            label="All"
            onClick={() => setFilterType('')}
            variant={!filterType ? 'filled' : 'outlined'}
            color={!filterType ? 'primary' : 'default'}
          />
          {workoutTypes.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              icon={t.icon}
              onClick={() => setFilterType(t.value)}
              variant={filterType === t.value ? 'filled' : 'outlined'}
              color={filterType === t.value ? 'primary' : 'default'}
            />
          ))}
        </Stack>

        {/* Workout List */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : workouts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No workouts logged yet. Start tracking!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            {workouts.map((w) => (
              <Grid item xs={12} sm={6} md={4} key={w._id}>
                <Card
                  sx={{
                    height: '100%',
                    borderLeft: `4px solid ${typeColors[w.type] || '#78909C'}`,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Chip
                        label={w.type}
                        size="small"
                        sx={{
                          bgcolor: `${typeColors[w.type]}20`,
                          color: typeColors[w.type],
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      />
                      <IconButton size="small" onClick={() => handleDelete(w._id)} sx={{ minWidth: 40, minHeight: 40 }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} gutterBottom>
                      {w.title}
                    </Typography>
                    <Stack direction="row" spacing={{ xs: 1.5, md: 2 }} sx={{ mb: 0.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', md: '0.75rem' }}>Duration</Typography>
                        <Typography fontWeight={600} fontSize={{ xs: '0.85rem', md: '1rem' }}>{w.duration} min</Typography>
                      </Box>
                      {w.distance > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', md: '0.75rem' }}>Distance</Typography>
                          <Typography fontWeight={600} fontSize={{ xs: '0.85rem', md: '1rem' }}>{w.distance} km</Typography>
                        </Box>
                      )}
                      {w.calories > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.65rem', md: '0.75rem' }}>Calories</Typography>
                          <Typography fontWeight={600} fontSize={{ xs: '0.85rem', md: '1rem' }}>{w.calories}</Typography>
                        </Box>
                      )}
                    </Stack>
                    {w.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {w.notes}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {new Date(w.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mobile FAB */}
        {isMobile && (
          <Fab
            color="secondary"
            onClick={() => setDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(255,109,0,0.4)',
            }}
          >
            <Add />
          </Fab>
        )}

        {/* Create Workout Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          TransitionComponent={isMobile ? Slide : undefined}
          TransitionProps={isMobile ? { direction: 'up' } : undefined}
        >
          <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Log New Workout
            {isMobile && (
              <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
            )}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              sx={{ mb: 2 }}
            >
              {workoutTypes.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </TextField>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Duration (min)"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Distance (km)"
                  type="number"
                  value={form.distance}
                  onChange={(e) => setForm({ ...form, distance: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Calories"
                  type="number"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Notes"
              multiline
              minRows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: { xs: 3, md: 2 }, flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} fullWidth={isMobile} sx={{ minHeight: 44 }}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreate}
              disabled={!form.title || !form.duration}
              fullWidth={isMobile}
              sx={{ minHeight: 44 }}
            >
              Save Workout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
