import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Videos, ErrorComponent, ShortsCard, SideBar } from './index';
import { fetchAPI } from '../utils/fetchAPI';
import { fetchDurationsForVideos } from '../utils/fetchDurations';
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
  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideosRaw, setRelatedVideosRaw] = useState([]);
  const [relatedVideosEnriched, setRelatedVideosEnriched] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const setSelectedCategory = useSidebarStore(
    (state) => state.setSelectedCategory
  );

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);

    try {
      const videoData = await fetchAPI(
        `videos?part=snippet,statistics&id=${id}`
      );
      const video = videoData?.data?.items?.[0];

      if (!video) throw new Error('Video not found');

      const { channelId, categoryId, title } = video.snippet;

      const relatedData = await fetchAPI(
        `search?part=snippet&relatedToVideoId=${id}&type=video&videoEmbeddable=true&maxResults=25`
      );
      const channelRes = await fetchAPI(
        `search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=6`
      );
      const keyword = extractSearchKeyword(title);
      const searchRes = await fetchAPI(
        `search?part=snippet&q=${encodeURIComponent(
          keyword
        )}&type=video&maxResults=6`
      );
      const categoryRes = await fetchAPI(
        `videos?part=snippet&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=IN&maxResults=6`
      );

      const merged = mergeAndDedupVideos(
        [
          ...(relatedData?.data?.items || []),
          ...(channelRes?.data?.items || []),
          ...(searchRes?.data?.items || []),
          ...(categoryRes?.data?.items || []),
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

  useEffect(() => {
    setSelectedCategory('');
    fetchVideoData();
  }, [id]);

  useEffect(() => {
    const enrich = async () => {
      const enriched = await fetchDurationsForVideos(relatedVideosRaw);
      setRelatedVideosEnriched(enriched);
    };
    enrich();
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
        onRetry={fetchVideoData}
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
        overflow: 'hidden',
      }}>
      {/* Sidebar */}
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
            marginLeft: { md: 2 },
            display: { xs: 'none', md: 'block' },
          }}>
          copyright 2025
        </Typography>
      </Box>

      {/* Main Video Section */}
      <Box sx={{ flex: 2, overflowY: 'auto', height: '100vh', px: 2 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '900px',
            mx: 'auto',
            mt: 2,
          }}>
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
                {channelTitle}
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
        </Box>

        {/* Shorts + Related */}
        <Box sx={{ width: '100%', mt: 5 }}>
          {/* Shorts */}
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

          {/* Related */}
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
