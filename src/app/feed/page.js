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
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Send,
  FlashOn,
  AddPhotoAlternate,
  Close,
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
  const { user, initialize } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: '', category: 'thought' });
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          <FlashOn sx={{ color: 'secondary.main', verticalAlign: 'middle', mr: 1 }} />
          Community Feed
        </Typography>

        {/* Create Post */}
        {user && (
          <Card sx={{ mb: 4, p: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name?.[0]?.toUpperCase()}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="Share your fitness thoughts..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    sx={{ mb: 2 }}
                  />

                  {/* Image Preview */}
                  {imagePreview && (
                    <Box sx={{ position: 'relative', mb: 2, display: 'inline-block' }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          borderRadius: 2,
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={clearSelectedImage}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
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

                      {/* Image Upload Button */}
                      <IconButton
                        component="label"
                        color="secondary"
                        sx={{
                          bgcolor: 'rgba(255,109,0,0.1)',
                          '&:hover': { bgcolor: 'rgba(255,109,0,0.2)' },
                        }}
                      >
                        <AddPhotoAlternate />
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageSelect}
                        />
                      </IconButton>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCreatePost}
                      disabled={posting || !newPost.content.trim()}
                      endIcon={<Send />}
                    >
                      {posting ? 'Posting...' : 'Post'}
                    </Button>
                  </Box>
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
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet. Be the first to share!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={3}>
            {posts.map((post) => (
              <Card key={post._id}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {post.author?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{post.author?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        ml: 'auto',
                        bgcolor: `${categoryColors[post.category]}20`,
                        color: categoryColors[post.category],
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {post.content}
                  </Typography>

                  {/* Post Image */}
                  {post.image && (
                    <Box
                      component="img"
                      src={post.image}
                      alt="Post image"
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    />
                  )}
                </CardContent>
                <Divider />
                <CardActions sx={{ px: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(post._id)}
                    color={post.likes?.includes(user?._id) ? 'error' : 'default'}
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
                  >
                    <ChatBubbleOutline />
                  </IconButton>
                  <Typography variant="caption">{post.comments?.length || 0}</Typography>
                </CardActions>

                {/* Comments */}
                {showComments[post._id] && (
                  <Box sx={{ px: 3, pb: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    {post.comments?.map((c, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 14, bgcolor: 'primary.dark' }}>
                          {c.user?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2, px: 2, py: 1, flex: 1 }}>
                          <Typography variant="caption" fontWeight={600}>
                            {c.user?.name}
                          </Typography>
                          <Typography variant="body2">{c.text}</Typography>
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
                        />
                        <IconButton color="primary" onClick={() => handleComment(post._id)}>
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
    </Box>
  );
}
