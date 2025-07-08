import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { SideBar, Videos, ErrorComponent, ShortsCard } from './index';
import { fetchCategory } from '../utils/fetchCategory';
import { fetchDurationsForVideos } from '../utils/fetchDurations';

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [rawVideos, setRawVideos] = useState([]);
  const [enrichedVideos, setEnrichedVideos] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  // Fetch videos for category
  const fetchVideos = async () => {
    // setLoading(true);
    setErrorCode(null);
    try {
      const videos = await fetchCategory(selectedCategory);
      setRawVideos(videos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setErrorCode(err?.response?.status || 500);
    } finally {
      // setLoading(false);
    }
  };

  // Enrich videos with durations
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

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const shorts = enrichedVideos.filter((v) => v?.isShort);
  const videos = enrichedVideos.filter((v) => !v?.isShort);

  // if (loading) {
  //   return (
  //     <Box
  //       sx={{
  //         height: '100vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         bgcolor: '#000',
  //       }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

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
        {/* Sidebar */}
        <Box
          sx={{
            height: { xs: 'auto', md: '100vh' },
            overflowY: 'auto',
            borderRight: { md: '1px solid #3d3d3d' },
            px: { xs: 0, md: 2 },
          }}>
          <SideBar
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
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

        {/* Error Content */}
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
        <SideBar
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
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

      {/* Main Feed */}
      <Box p={2} sx={{ flex: 2, overflowY: 'auto', height: '90vh' }}>
        {/* Shorts First */}
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

        {/* Main Videos */}
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {selectedCategory} <span style={{ color: '#F31503' }}>Videos</span>
        </Typography>
        <Videos Vid={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
