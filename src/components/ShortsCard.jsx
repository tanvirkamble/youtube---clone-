import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import useShortsStore from '../store/shortsStore';

const ShortsCard = ({
  video,
  allShorts = [],
  autoPlay = false,
  isFullScreen = false,
}) => {
  const navigate = useNavigate();
  const setShorts = useShortsStore((state) => state.setShorts);
  const setInitialVideoId = useShortsStore((state) => state.setInitialVideoId);

  const { snippet, seconds, isShort } = video || {};
  const videoId = video?.id?.videoId || video?.id;

  if (!isShort || !snippet || !videoId) return null;

  const handleClick = () => {
    if (isFullScreen) return; // Don’t navigate if already in ShortsPage
    setShorts(allShorts);
    setInitialVideoId(videoId);

    // 🔐 Save for fallback hydration
    localStorage.setItem('shorts_list', JSON.stringify(allShorts));
    localStorage.setItem('shorts_videoId', videoId);

    navigate('/shorts');
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: isFullScreen ? '100%' : 180,
        maxWidth: isFullScreen ? 360 : 'none',
        bgcolor: '#2c2c2c',
        borderRadius: 2,
        overflow: 'hidden',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        px: isFullScreen ? 1 : 0,
        py: isFullScreen ? 2 : 0,
        '&:hover': {
          transform: isFullScreen ? 'none' : 'scale(1.03)',
          transition: '0.3s ease',
        },
      }}>
      {/* 📽️ Video Section */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#000',
        }}>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          playing={autoPlay}
          muted
          loop
          width="100%"
          height={isFullScreen ? '90vh' : 280}
          style={{
            aspectRatio: '9/16',
            maxHeight: '90vh',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* 📄 Text Section */}
      <Box
        sx={{
          width: '100%',
          p: 1,
          bgcolor: '#1f1f1f',
          borderTop: '1px solid #444',
        }}>
        <Typography variant="body2" fontWeight="bold" noWrap>
          {snippet?.title}
        </Typography>
        <Typography
          variant="caption"
          color="gray"
          sx={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {snippet?.channelTitle}
        </Typography>
      </Box>
    </Card>
  );
};

export default ShortsCard;
