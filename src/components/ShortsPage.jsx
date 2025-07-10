import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import useShortsStore from '../store/shortsStore';
import { SideBar, ShortsCard } from './index';

const ShortsPage = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const shorts = useShortsStore((state) => state.shorts);
  const initialVideoId = useShortsStore((state) => state.initialVideoId);
  const setShorts = useShortsStore((state) => state.setShorts);
  const setInitialVideoId = useShortsStore((state) => state.setInitialVideoId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shorts.length === 0) {
      const savedShorts = JSON.parse(localStorage.getItem('shorts_list'));
      const savedVideoId = localStorage.getItem('shorts_videoId');
      if (savedShorts?.length && savedVideoId) {
        setShorts(savedShorts);
        setInitialVideoId(savedVideoId);
      } else {
        navigate('/');
        return;
      }
    }
    const timeout = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timeout);
  }, [shorts, navigate, setShorts, setInitialVideoId]);

  useEffect(() => {
    if (!initialVideoId || !shorts.length) return;
    const index = shorts.findIndex(
      (v) => v.id?.videoId === initialVideoId || v.id === initialVideoId
    );
    if (index !== -1 && containerRef.current) {
      const card = containerRef.current.children[index];
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [shorts, initialVideoId]);

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: '#000',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#000',
        overflow: 'hidden',
      }}>
      {/* Sidebar always visible */}
      <Box
        sx={{
          height: { xs: 'auto', md: '100vh' },
          overflowY: 'auto',
          borderRight: { md: '1px solid #3d3d3d' },
          px: { xs: 0, md: 2 },
        }}>
        <SideBar />
        {/* Show copyright on md+ only */}
        <Typography
          className="copyright"
          variant="body2"
          sx={{
            mt: 1,
            color: '#fff',
            ml: { md: 2 },
            display: { xs: 'none', md: 'block' },
          }}>
          copyright 2025
        </Typography>
      </Box>

      {/* Shorts container */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}>
        {shorts.map((video) => {
          const videoId = video?.id?.videoId || video?.id;
          if (!videoId) return null;

          return (
            <Box
              key={videoId}
              sx={{
                height: '100vh',
                scrollSnapAlign: 'start',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 1, sm: 2 },
              }}>
              <Box
                sx={{
                  maxHeight: '92vh',
                  maxWidth: '420px',
                  width: '100%',
                }}>
                <ShortsCard
                  video={video}
                  allShorts={shorts}
                  autoPlay
                  isFullScreen
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
};

export default ShortsPage;
