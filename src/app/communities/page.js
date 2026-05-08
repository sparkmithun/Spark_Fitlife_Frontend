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
  Avatar,
  AvatarGroup,
  CircularProgress,
  Fab,
  Slide,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Close, Groups, People, Search } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { communityAPI } from '@/lib/api';

const communityCategories = [
  'running',
  'weightlifting',
  'yoga',
  'crossfit',
  'cycling',
  'general',
  'nutrition',
  'mental-health',
];

const categoryColors = {
  running: '#FF6D00',
  weightlifting: '#1E88E5',
  yoga: '#AB47BC',
  crossfit: '#EF5350',
  cycling: '#42A5F5',
  general: '#78909C',
  nutrition: '#66BB6A',
  'mental-health': '#26C6DA',
};

export default function CommunitiesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, initialize } = useAuthStore();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: 'general' });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchCommunities = useCallback(async () => {
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      const { data } = await communityAPI.getAll(params);
      setCommunities(data.communities || []);
    } catch (err) {
      console.error('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCreate = async () => {
    try {
      await communityAPI.create(form);
      setDialogOpen(false);
      setForm({ name: '', description: '', category: 'general' });
      fetchCommunities();
    } catch (err) {
      console.error('Failed to create community');
    }
  };

  const handleJoin = async (id) => {
    try {
      await communityAPI.join(id);
      fetchCommunities();
    } catch (err) {
      console.error('Failed to join community');
    }
  };

  const handleLeave = async (id) => {
    try {
      await communityAPI.leave(id);
      fetchCommunities();
    } catch (err) {
      console.error('Failed to leave community');
    }
  };

  const filtered = searchQuery
    ? communities.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : communities;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, md: 4 }, pt: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
            <Groups sx={{ color: 'secondary.main', verticalAlign: 'middle', mr: 0.5, fontSize: { xs: 24, md: 28 } }} />
            Communities
          </Typography>
          {user && !isMobile && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Create Community
            </Button>
          )}
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }}
          size={isMobile ? 'small' : 'medium'}
          sx={{ mb: { xs: 2, md: 3 } }}
        />

        {/* Category Filter */}
        <Stack direction="row" spacing={1} sx={{ mb: { xs: 2, md: 4 }, flexWrap: 'nowrap', overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip
            label="All"
            onClick={() => setFilterCategory('')}
            variant={!filterCategory ? 'filled' : 'outlined'}
            color={!filterCategory ? 'primary' : 'default'}
          />
          {communityCategories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? 'filled' : 'outlined'}
              color={filterCategory === cat ? 'primary' : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Stack>

        {/* Community Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filtered.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No communities found. Create one!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 1.5, md: 3 }}>
            {filtered.map((community) => {
              const isMember = community.members?.some(
                (m) => (typeof m === 'string' ? m : m._id) === user?._id
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={community._id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s, border-color 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: categoryColors[community.category],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: categoryColors[community.category] || '#78909C',
                        borderRadius: '16px 16px 0 0',
                      }}
                    />
                    <CardContent sx={{ pt: { xs: 2, md: 3 }, px: { xs: 2, md: 2 }, pb: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600} noWrap sx={{ maxWidth: '60%' }}>
                          {community.name}
                        </Typography>
                        <Chip
                          label={community.category}
                          size="small"
                          sx={{
                            bgcolor: `${categoryColors[community.category]}20`,
                            color: categoryColors[community.category],
                            textTransform: 'capitalize',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                        {community.description || 'No description yet.'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
                            {community.members?.slice(0, 3).map((m, i) => (
                              <Avatar key={i} sx={{ bgcolor: 'primary.main' }}>
                                {(typeof m === 'string' ? '?' : m.name?.[0])?.toUpperCase()}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                          <Typography variant="caption" color="text.secondary">
                            <People sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.3 }} />
                            {community.members?.length || 0}
                          </Typography>
                        </Box>

                        {user && (
                          isMember ? (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleLeave(community._id)}
                            >
                              Leave
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleJoin(community._id)}
                            >
                              Join
                            </Button>
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Mobile FAB */}
        {user && isMobile && (
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

        {/* Create Community Dialog */}
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
            Create New Community
            {isMobile && (
              <IconButton onClick={() => setDialogOpen(false)}><Close /></IconButton>
            )}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Community Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {communityCategories.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: { xs: 3, md: 2 }, flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} fullWidth={isMobile} sx={{ minHeight: 44 }}>Cancel</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreate}
              disabled={!form.name.trim()}
              fullWidth={isMobile}
              sx={{ minHeight: 44 }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
