'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Person,
  FitnessCenter,
  Groups,
  People,
  CameraAlt,
} from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { userAPI, workoutAPI } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ProfilePage() {
  const { user, initialize, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', fitnessGoals: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await userAPI.getProfile(user._id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await workoutAPI.getStats();
      setStats(data || []);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setAvatarUploading(true);
    try {
      const { url } = await uploadToCloudinary(file, 'spark-fitlife/avatars');
      const { data } = await userAPI.updateProfile({ avatar: url });
      setProfile(data);
      updateUser(data);
    } catch (err) {
      console.error('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      name: profile?.name || '',
      bio: profile?.bio || '',
      fitnessGoals: (profile?.fitnessGoals || []).join(', '),
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    try {
      const { data } = await userAPI.updateProfile({
        name: editForm.name,
        bio: editForm.bio,
        fitnessGoals: editForm.fitnessGoals.split(',').map((g) => g.trim()).filter(Boolean),
      });
      setProfile(data);
      updateUser(data);
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600}>
            Sign in to view your profile
          </Typography>
        </Card>
      </Box>
    );
  }

  const totalWorkouts = stats.reduce((s, st) => s + st.count, 0);
  const totalDuration = stats.reduce((s, st) => s + st.totalDuration, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Profile Header */}
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <Box
            sx={{
              height: 140,
              background: 'linear-gradient(135deg, #1E88E5 0%, #FF6D00 100%)',
              borderRadius: '16px 16px 0 0',
            }}
          />
          <CardContent sx={{ textAlign: 'center', mt: -6 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  bgcolor: 'primary.main',
                  border: '4px solid #141414',
                  mx: 'auto',
                  mb: 2,
                }}
                src={profile?.avatar}
              >
                {profile?.name?.[0]?.toUpperCase()}
              </Avatar>
              {/* Avatar upload overlay */}
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: -4,
                  bgcolor: 'secondary.main',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
                disabled={avatarUploading}
              >
                <CameraAlt sx={{ fontSize: 16 }} />
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                />
              </IconButton>
              {avatarUploading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    mt: '-12px',
                    ml: '-12px',
                    color: 'secondary.main',
                  }}
                />
              )}
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {profile?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
              {profile?.bio || 'No bio yet. Tell the community about yourself!'}
            </Typography>

            {profile?.fitnessGoals?.length > 0 && (
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2, flexWrap: 'wrap' }}>
                {profile.fitnessGoals.map((goal, i) => (
                  <Chip key={i} label={goal} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>
            )}

            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ mt: 3 }}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <FitnessCenter sx={{ color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight={700}>{totalWorkouts}</Typography>
              <Typography variant="caption" color="text.secondary">Workouts</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h5" fontWeight={700}>{totalDuration} min</Typography>
              <Typography variant="caption" color="text.secondary">Total Duration</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <People sx={{ color: 'secondary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight={700}>{profile?.followers?.length || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Followers</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', py: 3 }}>
              <Groups sx={{ color: 'secondary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight={700}>{profile?.communities?.length || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Communities</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Workout Breakdown */}
        {stats.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Workout Breakdown
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {stats.map((s) => (
                  <Box
                    key={s._id}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Chip label={s._id} sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                    <Typography variant="body2">
                      {s.count} sessions · {s.totalDuration} min · {s.totalCalories} cal
                      {s.totalDistance > 0 && ` · ${s.totalDistance.toFixed(1)} km`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              minRows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Fitness Goals (comma-separated)"
              value={editForm.fitnessGoals}
              onChange={(e) => setEditForm({ ...editForm, fitnessGoals: e.target.value })}
              helperText="e.g. Lose weight, Build muscle, Run a marathon"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
