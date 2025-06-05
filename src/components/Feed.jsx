import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { SideBar, Videos, ErrorComponent } from './index';
import { fetchAPI } from '../utils/fetchAPI';

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [videos, setVideos] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  const fetchVideos = async () => {
    // setLoading(true);
    setErrorCode(null);

    try {
      const data = await fetchAPI(`search?part=snippet&q=${selectedCategory}`);
      // console.log('Fetched data:', data.data.items);
      if (data.errorCode) {
        setErrorCode(data.errorCode);
      } else {
        setVideos(data.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setErrorCode(error?.response?.status || 500);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  // if (loading) {
  //   return (
  //     <Box
  //       sx={{
  //         height: '100vh',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         mt: 8,
  //       }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  if (errorCode) {
    return (
      <ErrorComponent
        errorCode={errorCode}
        onRetry={fetchVideos}
        msg={`trying to fetch videos for ${selectedCategory}`}
      />
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
          copyyright 2025
        </Typography>
      </Box>

      <Box p={2} sx={{ flex: 2, overflowY: 'auto', height: '90vh' }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {selectedCategory} <span style={{ color: '#F31503' }}>Videos</span>
        </Typography>

        <Videos Vid={videos || []} />
      </Box>
    </Stack>
  );
};

export default Feed;
