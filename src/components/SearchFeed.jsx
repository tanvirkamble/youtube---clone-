import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { SideBar, Videos, ErrorComponent, ShortsCard } from './index';
import { fetchAPI } from '../utils/fetchAPI';
import { fetchDurationsForVideos } from '../utils/fetchDurations';
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
      const rawVideos = data.data.items || [];

      // 👇 Enrich like Feed.jsx
      const enriched = await fetchDurationsForVideos(rawVideos);
      setVideos(enriched);
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

  const shorts = videos.filter((v) => v?.isShort);
  const mainVideos = videos.filter((v) => !v?.isShort);

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
        msg={`Trying to search videos for '${searchedTerm}'`}
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
        bgcolor: '#000',
      }}>
      <Typography variant="h4" fontWeight="bold" mb={5}>
        Search Results For:{' '}
        <span style={{ color: '#F31503' }}>{searchedTerm}</span>
      </Typography>
      {/* Shorts First */}
      {shorts.length > 0 && (
        <Box sx={{ width: '90%', mb: 5 }}>
          <Typography variant="h5" color="white" mb={2} fontWeight="bold">
            {searchedTerm} <span style={{ color: '#F31503' }}>Shorts</span>
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

      {/* Main Search Results */}
      <Typography variant="h4" fontWeight="bold" mb={5}>
        {searchedTerm} <span style={{ color: '#F31503' }}>Videos</span>
      </Typography>
      <Videos Vid={mainVideos || []} direction="horizontal" />
    </Box>
  );
};

export default SearchFeed;
