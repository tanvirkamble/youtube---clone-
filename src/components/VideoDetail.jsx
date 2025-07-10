import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { CheckCircle, ExpandMore, ExpandLess } from '@mui/icons-material';
import { Videos, ErrorComponent, ShortsCard, SideBar } from './index';
import { fetchAPI, fetchComments, fetchDurationsForVideos } from '../utils';
import useSidebarStore from '../store/sidebarStore';

const extractSearchKeyword = (title = '') => {
  const stopwords = ['the', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for'];
  return title
    .split(' ')
    .filter((word) => !stopwords.includes(word.toLowerCase()))
    .slice(0, 4)
    .join(' ');
};

const mergeAndDedupVideos = (videoArrays, currentId) => {
  const seen = new Set();
  const merged = [];

  videoArrays.flat().forEach((video) => {
    const videoId = video?.id?.videoId || video?.id;
    if (videoId && !seen.has(videoId) && videoId !== currentId) {
      seen.add(videoId);
      merged.push(video);
    }
  });

  return merged;
};

const VideoDetail = () => {
  const { id } = useParams();
  const setSelectedCategory = useSidebarStore(
    (state) => state.setSelectedCategory
  );

  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideosRaw, setRelatedVideosRaw] = useState([]);
  const [relatedVideosEnriched, setRelatedVideosEnriched] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      setError(null);
      try {
        const videoRes = await fetchAPI(
          `videos?part=snippet,statistics&id=${id}`
        );
        const video = videoRes?.data?.items?.[0];
        if (!video) throw new Error('Video not found');

        const { channelId, categoryId, title } = video.snippet;
        const keyword = extractSearchKeyword(title);

        const related = await fetchAPI(
          `search?part=snippet&relatedToVideoId=${id}&type=video&videoEmbeddable=true&maxResults=25`
        );
        const channel = await fetchAPI(
          `search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=6`
        );
        const search = await fetchAPI(
          `search?part=snippet&q=${encodeURIComponent(
            keyword
          )}&type=video&maxResults=6`
        );
        const category = await fetchAPI(
          `videos?part=snippet&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=IN&maxResults=6`
        );

        const merged = mergeAndDedupVideos(
          [
            related?.data?.items || [],
            channel?.data?.items || [],
            search?.data?.items || [],
            category?.data?.items || [],
          ],
          id
        );

        setVideoDetail(video);
        setRelatedVideosRaw(merged);
      } catch (err) {
        console.error(err);
        setError('500');
      }
      setLoading(false);
    };

    const fetchCommentData = async () => {
      setLoadingComments(true);
      try {
        const data = await fetchComments(id);
        setComments(data);
      } catch (err) {
        console.error('Comment error:', err);
        setCommentError('Could not load comments');
      }
      setLoadingComments(false);
    };

    setSelectedCategory('');
    fetchVideoData();
    fetchCommentData();
  }, [id]);

  useEffect(() => {
    const enrichDurations = async () => {
      const enriched = await fetchDurationsForVideos(relatedVideosRaw);
      setRelatedVideosEnriched(enriched);
    };
    enrichDurations();
  }, [relatedVideosRaw]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        error={error}
        onRetry={() => window.location.reload()}
        msg="Failed to load video details"
      />
    );
  }

  if (!videoDetail) return null;

  const {
    snippet: { title, channelId, channelTitle },
    statistics: { viewCount, likeCount, commentCount },
  } = videoDetail;

  const shorts = relatedVideosEnriched.filter((v) => v?.isShort);
  const mainVideos = relatedVideosEnriched.filter((v) => !v?.isShort);

  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#000',
        minHeight: '100vh',
        width: '100%',
      }}>
      <Box
        sx={{
          height: { xs: 'auto', md: '100vh' },
          overflowY: 'auto',
          borderRight: { md: '1px solid #3d3d3d' },
          px: { xs: 0, md: 2 },
        }}>
        <SideBar />
        <Typography
          className="copyright"
          variant="body2"
          sx={{
            mt: 1,
            color: '#fff',
            ml: 2,
            display: { xs: 'none', md: 'block' },
          }}>
          copyright 2025
        </Typography>
      </Box>

      <Box sx={{ flex: 2, overflowY: 'auto', height: '100vh', px: 2 }}>
        <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', mt: 2 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              mb: 2,
            }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </Box>

          <Typography color="#fff" variant="h6" fontWeight="bold" mb={1}>
            {title}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ color: '#fff' }}
            py={1}
            px={2}>
            <Link to={`/channel/${channelId}`}>
              <Typography variant="subtitle1" color="#fff">
                {channelTitle}{' '}
                <CheckCircle
                  sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
                />
              </Typography>
            </Link>
            <Stack direction="row" gap="20px" alignItems="center">
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                {parseInt(viewCount).toLocaleString()} views
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                {parseInt(likeCount).toLocaleString()} likes
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                {parseInt(commentCount).toLocaleString()} comments
              </Typography>
            </Stack>
          </Stack>

          {/* Comments Toggle */}
          <Box sx={{ mt: 2, px: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => setShowComments(!showComments)}
              sx={{
                color: showComments ? 'red' : '#00e676',
                border: '2px solid #444',
                borderRadius: '50%',
                backgroundColor: '#1e1e1e',
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                  borderColor: '#666',
                },
              }}>
              {showComments ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Typography sx={{ ml: 1, color: '#fff', fontWeight: 500 }}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Typography>
          </Box>

          {showComments && (
            <Box
              sx={{
                width: '100%',
                mt: 3,
                px: 2,
                height: '50vh',
                overflowY: 'auto',
              }}>
              <Typography variant="h6" fontWeight="bold" mb={2} color="#fff">
                Comments
              </Typography>
              {loadingComments ? (
                <Typography color="gray">Loading comments...</Typography>
              ) : commentError ? (
                <Typography color="error">{commentError}</Typography>
              ) : comments.length === 0 ? (
                <Typography color="gray">No comments found.</Typography>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{ p: 2, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {comment.author}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#fff' }}
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      />
                      <Divider sx={{ mt: 1, borderColor: '#444' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ width: '100%', mt: 5 }}>
          {shorts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                color="white"
                mb={1}
                fontWeight="bold"
                sx={{ ml: 1 }}>
                Related Shorts
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  pb: 1,
                }}>
                {shorts.map((short, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      minWidth: '140px',
                      maxWidth: '140px',
                      flex: '0 0 auto',
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: '#1e1e1e',
                    }}>
                    <ShortsCard video={short} allShorts={shorts} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="h6" fontWeight="bold" mb={2} color="#fff">
            Related Videos
          </Typography>
          <Videos Vid={mainVideos} direction="horizontal" />
        </Box>
      </Box>
    </Stack>
  );
};

export default VideoDetail;
