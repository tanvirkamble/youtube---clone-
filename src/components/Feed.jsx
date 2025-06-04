import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { SideBar, Videos } from './index';
import { fetchAPI } from '../utils/fetchAPI';

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('New');
  const [videos, setVideos] = useState([]);
  // console.log('fetch file KEY:', import.meta.env.VITE_RAPID_API_KEY);

  useEffect(() => {
    fetchAPI(`search?part=snippet&q=${selectedCategory}`)
      .then((data) => {
        setVideos(data.items);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [selectedCategory]);

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

        <Videos Vid={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
