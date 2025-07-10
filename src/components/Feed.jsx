import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { SideBar, Videos, ErrorComponent, ShortsCard, Channels } from './index';
import { fetchCategory, fetchDurationsForVideos } from '../utils';
import useSidebarStore from '../store/sidebarStore';

const Feed = () => {
  const selectedCategory = useSidebarStore((state) => state.selectedCategory);

  const [rawVideos, setRawVideos] = useState([]);
  const [enrichedVideos, setEnrichedVideos] = useState([]);
  const [rawChannels, setRawChannels] = useState([]);
  const [errorCode, setErrorCode] = useState(null);

  // Fetch category data
  const fetchVideos = async () => {
    setErrorCode(null);
    try {
      const { videos, channels } = await fetchCategory(selectedCategory);
      setRawVideos(videos);
      setRawChannels(channels);
      console.log('Channels', channels);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setErrorCode(err?.response?.status || 500);
    }
  };

  // Enrich videos with duration/shorts data
  useEffect(() => {
    const enrich = async () => {
      if (rawVideos.length > 0) {
        const enriched = await fetchDurationsForVideos(rawVideos);
        setEnrichedVideos(enriched);
      } else {
        setEnrichedVideos([]);
      }
    };
    enrich();
  }, [rawVideos]);

  // Refetch on category change
  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const shorts = enrichedVideos.filter((v) => v?.isShort);
  const videos = enrichedVideos.filter((v) => !v?.isShort);

  if (errorCode) {
    return (
      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          backgroundColor: '#000',
          height: '100vh',
        }}
        p={2}
        gap={2}>
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

        <Box
          sx={{
            flex: 2,
            overflowY: 'auto',
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ErrorComponent
            errorCode={errorCode}
            onRetry={fetchVideos}
            msg={`Trying to fetch videos for '${selectedCategory}'`}
          />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#000',
        height: '100vh',
      }}
      p={2}
      gap={2}>
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

      {/* Main Content */}
      <Box p={2} sx={{ flex: 2, overflowY: 'auto', height: '90vh' }}>
        {/* Shorts Section */}
        {shorts.length > 0 && (
          <Box sx={{ width: '100%', mb: 5 }}>
            <Typography variant="h5" color="white" mb={2} fontWeight="bold">
              {selectedCategory}{' '}
              <span style={{ color: '#F31503' }}>Shorts</span>
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
                    minWidth: '180px',
                    maxWidth: '180px',
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

        {/* Channels Section */}
        {selectedCategory.toLowerCase() !== 'new' && rawChannels.length > 0 && (
          <Box sx={{ width: '100%', mb: 5 }}>
            <Typography variant="h5" color="white" mb={2} fontWeight="bold">
              {selectedCategory}{' '}
              <span style={{ color: '#F31503' }}>Channels</span>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                pb: 1,
                px: 1,
              }}>
              <Channels channels={rawChannels} />
            </Box>
          </Box>
        )}

        {/* Main Videos Section */}
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {selectedCategory} <span style={{ color: '#F31503' }}>Videos</span>
        </Typography>
        <Videos Vid={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
