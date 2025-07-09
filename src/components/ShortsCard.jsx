import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { CheckCircle } from '@mui/icons-material';
import useShortsStore from '../store/shortsStore';

const ShortsCard = ({
  video,
  allShorts = [],
  autoPlay = false,
  isFullScreen = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isShortsPage = location.pathname === '/shorts';

  const setShorts = useShortsStore((state) => state.setShorts);
  const setInitialVideoId = useShortsStore((state) => state.setInitialVideoId);

  const { snippet, isShort } = video || {};
  const videoId = video?.id?.videoId || video?.id;

  if (!isShort || !snippet || !videoId) return null;

  const handleClick = () => {
    if (isFullScreen) return;
    setShorts(allShorts);
    setInitialVideoId(videoId);
    localStorage.setItem('shorts_list', JSON.stringify(allShorts));
    localStorage.setItem('shorts_videoId', videoId);
    navigate('/shorts');
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        borderRadius: isShortsPage ? '28px' : '0px',
        overflow: 'hidden',
        bgcolor: '#1e1e1e',
        width: isFullScreen ? '360px' : 180,
        height: isFullScreen ? '80vh' : 'auto',
        aspectRatio: isFullScreen ? '9/16' : 'auto',
        boxShadow: isShortsPage ? '0 0 20px rgba(255, 0, 0, 0.3)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: isFullScreen ? 'default' : 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: isFullScreen ? 'none' : 'scale(1.03)',
        },
      }}>
      {/* 🎥 Video */}
      <Box
        sx={{
          width: '100%',
          height: isFullScreen ? '85%' : 280,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#000',
        }}>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          playing={autoPlay}
          muted
          loop
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* 📄 Info */}
      <Box
        sx={{
          bgcolor: '#111',
          p: 1.5,
          height: isFullScreen ? '15%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Typography
          variant="subtitle2"
          color="#fff"
          noWrap
          sx={{ fontWeight: 600 }}>
          {snippet?.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography
            variant="caption"
            color="gray"
            noWrap
            sx={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            {snippet?.channelTitle}
          </Typography>
          <CheckCircle sx={{ fontSize: 14, color: 'gray' }} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ShortsCard;
