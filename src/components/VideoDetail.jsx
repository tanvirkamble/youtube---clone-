import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Videos, ErrorComponent, ShortsCard } from './index';
import { fetchAPI } from '../utils/fetchAPI';
import { fetchDurationsForVideos } from '../utils/fetchDurations';

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
    <Box minHeight="95vh" p={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {/* Video Player Left Side */}
        <Box flex={1}>
          <Box
            sx={{
              transform: { sm: 'scale(0.9)', md: 'scale(1)' },
              width: { sm: '725px', md: '900px' },
              position: 'sticky',
              top: '30px',
            }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
              width="100%"
            />
            <Typography color="#fff" variant="h6" fontWeight="bold" p={1}>
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

        {/* Right Section — Shorts + Related */}
        <Box
          px={{ xs: 2, sm: 5, md: -1 }}
          py={{ md: 1, xs: 5 }}
          sx={{
            position: 'sticky',
            top: '60px',
            maxWidth: '500px',
          }}>
          {/* Shorts Section */}
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
                  width: '100%',
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

          {/* Related Videos */}
          <Typography variant="h6" fontWeight="bold" mb={2} color="#fff">
            Related Videos
          </Typography>
          <Videos
            Vid={mainVideos}
            direction="horizontal"
            maxWidth="500px"
            thumbHeight="100%"
            thumbWidth="100%"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
