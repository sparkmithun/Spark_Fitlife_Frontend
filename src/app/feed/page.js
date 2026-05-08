'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Slide,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Send,
  FlashOn,
  AddPhotoAlternate,
  Close,
  Add,
} from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { postAPI } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

const categories = [
  { value: 'thought', label: 'Thought' },
  { value: 'progress', label: 'Progress' },
  { value: 'tip', label: 'Tip' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'question', label: 'Question' },
];

const categoryColors = {
  thought: '#1E88E5',
  progress: '#FF6D00',
  tip: '#66BB6A',
  motivation: '#AB47BC',
  question: '#42A5F5',
};

export default function FeedPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, initialize } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: '', category: 'thought' });
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await postAPI.getFeed({ page: 1, limit: 20 });
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;
    setPosting(true);
    try {
      let imageUrl = '';
      if (selectedImage) {
        const result = await uploadToCloudinary(selectedImage, 'spark-fitlife/posts');
        imageUrl = result.url;
      }
      await postAPI.create({ ...newPost, image: imageUrl });
      setNewPost({ content: '', category: 'thought' });
      setSelectedImage(null);
      setImagePreview(null);
      setCreateDialogOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.toggleLike(postId);
      fetchPosts();
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    try {
      await postAPI.addComment(postId, text);
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  // Create Post Dialog (full screen on mobile)
  const CreatePostDialog = () => (
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      TransitionComponent={isMobile ? Slide : undefined}
      TransitionProps={isMobile ? { direction: 'up' } : undefined}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>Create Post</Typography>
        <IconButton onClick={() => setCreateDialogOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          fullWidth
          multiline
          minRows={isMobile ? 4 : 3}
          placeholder="What's on your fitness mind?"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          sx={{ mb: 2 }}
          autoFocus
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={imagePreview}
              sx={{
                width: '100%',
                maxHeight: isMobile ? 200 : 250,
                borderRadius: 2,
                objectFit: 'cover',
              }}
            />
            <IconButton
              size="small"
              onClick={clearSelectedImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.7)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={newPost.category}
            label="Category"
            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<AddPhotoAlternate />}
          sx={{ mr: 'auto' }}
        >
          Photo
          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect}
          />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreatePost}
          disabled={posting || !newPost.content.trim()}
          endIcon={<Send />}
          sx={{ minWidth: 100 }}
        >
          {posting ? 'Posting...' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 10, md: 4 }, pt: { xs: 2, md: 4 } }}>
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: { xs: 0.5, md: 0 } }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
            <FlashOn sx={{ color: 'secondary.main', verticalAlign: 'middle', mr: 0.5, fontSize: { xs: 24, md: 28 } }} />
            Feed
          </Typography>
        </Box>

        {/* Desktop Create Post Card */}
        {user && !isMobile && (
          <Card sx={{ mb: 3, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }} src={user.avatar}>
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box
                  sx={{ flexGrow: 1, cursor: 'pointer' }}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <TextField
                    fullWidth
                    placeholder="Share your fitness thoughts..."
                    InputProps={{ readOnly: true }}
                    sx={{ pointerEvents: 'none' }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6, mx: { xs: 0 } }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet. Be the first to share!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={{ xs: 1.5, md: 3 }}>
            {posts.map((post) => (
              <Card key={post._id} sx={{ borderRadius: { xs: 2, md: 4 } }}>
                <CardContent sx={{ px: { xs: 2, md: 3 }, py: { xs: 1.5, md: 2 } }}>
                  {/* Post Header */}
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, bgcolor: 'primary.main' }}
                      src={post.author?.avatar}
                    >
                      {post.author?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={600} fontSize={{ xs: '0.9rem', md: '1rem' }} noWrap>
                        {post.author?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        bgcolor: `${categoryColors[post.category]}20`,
                        color: categoryColors[post.category],
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                  </Box>

                  {/* Post Content */}
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, lineHeight: 1.7, fontSize: { xs: '0.9rem', md: '0.95rem' } }}
                  >
                    {post.content}
                  </Typography>

                  {/* Post Image */}
                  {post.image && (
                    <Box
                      component="img"
                      src={post.image}
                      alt="Post"
                      sx={{
                        width: '100%',
                        maxHeight: { xs: 250, md: 400 },
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                  )}
                </CardContent>

                {/* Actions */}
                <CardActions sx={{ px: { xs: 1.5, md: 2 }, py: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(post._id)}
                    color={post.likes?.includes(user?._id) ? 'error' : 'default'}
                    sx={{ minWidth: 44, minHeight: 44 }}
                  >
                    {post.likes?.includes(user?._id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography variant="caption" sx={{ mr: 2 }}>
                    {post.likes?.length || 0}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setShowComments({ ...showComments, [post._id]: !showComments[post._id] })
                    }
                    sx={{ minWidth: 44, minHeight: 44 }}
                  >
                    <ChatBubbleOutline />
                  </IconButton>
                  <Typography variant="caption">{post.comments?.length || 0}</Typography>
                </CardActions>

                {/* Comments Section */}
                {showComments[post._id] && (
                  <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
                    <Divider sx={{ mb: 1.5 }} />
                    {post.comments?.map((c, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: 12, bgcolor: 'primary.dark' }}>
                          {c.user?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, px: 1.5, py: 0.8, flex: 1 }}>
                          <Typography variant="caption" fontWeight={600} display="block">
                            {c.user?.name}
                          </Typography>
                          <Typography variant="body2" fontSize="0.82rem">{c.text}</Typography>
                        </Box>
                      </Box>
                    ))}
                    {user && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          value={commentText[post._id] || ''}
                          onChange={(e) =>
                            setCommentText({ ...commentText, [post._id]: e.target.value })
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                          sx={{ '& input': { fontSize: '0.85rem', py: 1 } }}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleComment(post._id)}
                          sx={{ minWidth: 44, minHeight: 44 }}
                        >
                          <Send fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )}
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      {/* Mobile FAB for creating post */}
      {isMobile && user && (
        <Fab
          color="secondary"
          onClick={() => setCreateDialogOpen(true)}
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

      <CreatePostDialog />
    </Box>
  );
}
