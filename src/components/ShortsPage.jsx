import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useShortsStore from '../store/shortsStore';
import ShortsCard from './ShortsCard';

const ShortsPage = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const shorts = useShortsStore((state) => state.shorts);
  const initialVideoId = useShortsStore((state) => state.initialVideoId);
  const setShorts = useShortsStore((state) => state.setShorts);
  const setInitialVideoId = useShortsStore((state) => state.setInitialVideoId);

  const [loading, setLoading] = useState(true);

  // 🧠 Restore from localStorage if Zustand is empty
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

  // 🎯 Scroll to focused video
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
    <Box
      ref={containerRef}
      sx={{
        bgcolor: '#000',
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}>
      {shorts.map((video, idx) => {
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
              px: 1,
              py: 2,
            }}>
            <ShortsCard
              video={video}
              allShorts={shorts}
              autoPlay // ⬅️ Custom prop to tell card to autoplay video
              isFullScreen // ⬅️ Custom prop to adjust layout for full-screen mode
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default ShortsPage;
