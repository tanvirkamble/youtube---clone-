import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';

const ShortsCard = ({ video }) => {
  const { snippet, seconds, isShort } = video;

  if (!isShort) return null; // Only render shorts

  return (
    <Card
      sx={{
        width: 180,
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        overflow: 'hidden',
        color: '#fff',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)',
          transition: '0.3s ease',
        },
      }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={snippet?.thumbnails?.high?.url}
          alt={snippet?.title}
          sx={{
            height: 280,
            width: '100%',
            objectFit: 'cover',
          }}
        />
        {seconds !== undefined && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: 12,
            }}>
            {seconds}s
          </Box>
        )}
      </Box>

      <Box p={1}>
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
