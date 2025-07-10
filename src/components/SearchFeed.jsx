import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { SideBar, Videos, ErrorComponent, ShortsCard } from './index';
import { fetchAPI, fetchDurationsForVideos } from '../utils';
import { useParams } from 'react-router-dom';
import useSidebarStore from '../store/sidebarStore';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const { searchedTerm } = useParams();

  const setSelectedCategory = useSidebarStore(
    (state) => state.setSelectedCategory
  );

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setErrorCode(null);
      try {
        const data = await fetchAPI(`search?part=snippet&q=${searchedTerm}`);
        const rawVideos = data.data.items || [];
        const enriched = await fetchDurationsForVideos(rawVideos);
        setVideos(enriched);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setErrorCode(error?.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };

    // ❌ Clear the sidebar category because we're not on Feed page
    setSelectedCategory('');
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
        onRetry={() => {
          setSelectedCategory('');
          // fetchVideos();
        }}
        msg={`Trying to search videos for '${searchedTerm}'`}
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
        <Typography variant="h4" fontWeight="bold" mb={5}>
          Search Results For:{' '}
          <span style={{ color: '#F31503' }}>{searchedTerm}</span>
        </Typography>

        {/* Shorts Section */}
        {shorts.length > 0 && (
          <Box sx={{ width: '100%', mb: 5 }}>
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

        {/* Main Videos Section */}
        <Typography variant="h4" fontWeight="bold" mb={5}>
          {searchedTerm} <span style={{ color: '#F31503' }}>Videos</span>
        </Typography>
        <Videos Vid={mainVideos || []} direction="horizontal" />
      </Box>
    </Stack>
  );
};

export default SearchFeed;
