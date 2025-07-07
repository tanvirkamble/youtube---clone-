import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { SideBar, Videos, ErrorComponent } from './index';
import { fetchAPI } from '../utils/fetchAPI';
import { useParams } from 'react-router-dom';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const { searchedTerm } = useParams();

  const fetchVideos = async () => {
    setLoading(true);
    setErrorCode(null);

    try {
      const data = await fetchAPI(`search?part=snippet&q=${searchedTerm}`);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchedTerm]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          bgcolor: '#000',
        }}>
        <CircularProgress />
      </Box>
    );
  }
  if (errorCode) {
    return (
      <ErrorComponent
        errorCode={errorCode}
        onRetry={fetchVideos}
        msg={`trying to search videos for ${searchedTerm}`}
      />
    );
  }

  return (
    <Box
      p={2}
      sx={{
        flex: 2,
        overflowY: 'auto',
        height: '90vh',
        ml: { xs: '4px', md: '10%' },
      }}>
      <Typography variant="h4" fontWeight="bold" mb={5}>
        Search Results For:{' '}
        <span style={{ color: '#F31503' }}>{searchedTerm}</span> Videos
      </Typography>
      <Videos Vid={videos || []} direction="horizontal" />
    </Box>
  );
};

export default SearchFeed;
