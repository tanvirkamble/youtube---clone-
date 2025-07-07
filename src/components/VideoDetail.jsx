import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Videos } from './';
import { fetchAPI } from '../utils/fetchAPI';
import CircularProgress from '@mui/material/CircularProgress';
import { ErrorComponent } from './index';

// Helper: Extract first few keywords from title
const extractSearchKeyword = (title = '') => {
  const stopwords = ['the', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for'];
  return title
    .split(' ')
    .filter((word) => !stopwords.includes(word.toLowerCase()))
    .slice(0, 4)
    .join(' ');
};

// Helper: Merge and deduplicate video array
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
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);

    try {
      //Fetch the main video data
      const videoData = await fetchAPI(
        `videos?part=snippet,statistics&id=${id}`
      );

      const video = videoData?.data?.items?.[0];

      if (!video) throw new Error('Video not found');

      const channelId = video?.snippet?.channelId;
      const categoryId = video?.snippet?.categoryId;
      const title = video?.snippet?.title;

      // Fetch related by video
      const relatedData = await fetchAPI(
        `search?part=snippet&relatedToVideoId=${id}&type=video&videoEmbeddable=true&maxResults=25`
      );

      // Fetch related by same channel
      const channelRes = await fetchAPI(
        `search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=6`
      );

      // Related by keyword
      const keyword = extractSearchKeyword(title);
      const searchRes = await fetchAPI(
        `search?part=snippet&q=${encodeURIComponent(
          keyword
        )}&type=video&maxResults=6`
      );

      // Related by category
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
      if (videoData.error || relatedData.error) {
        setError(videoData.error || relatedData.error);
      } else {
        setVideoDetail(video);
        setRelatedVideos(merged);
      }
    } catch (err) {
      console.error(err);
      setError('500'); // fallback error code
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVideoData();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
        }}>
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
  } = videoDetail || {};

  return (
    <Box minHeight="95vh" p={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Box flex={1}>
          <Box
            sx={{
              transform: { sm: 'scale(0.9)', md: 'scale(1)' },
              width: { sm: '725px', md: '900px' },
              position: 'sticky',
              top: '86px',
            }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ color: '#fff' }}
              py={1}
              px={2}>
              <Link to={`/channel/${channelId}`}>
                <Typography
                  variant={{ sm: 'subtitle1', md: 'h6' }}
                  color="#fff">
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
        </Box>

        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent={'center'}
          alignContent={'center'}>
          <Typography variant="h4" fontWeight="bold" mb={2} color="#fff">
            Related Videos
          </Typography>
          <Videos
            Vid={relatedVideos}
            direction="horizontal"
            maxWidth="500px"
            thumbHeight="200px"
            thumbWidth="250px"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
