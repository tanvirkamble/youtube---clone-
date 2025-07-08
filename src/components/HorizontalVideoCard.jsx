// components/HorizontalVideoCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import {
  demoChannelTitle,
  demoChannelUrl,
  demoVideoUrl,
  demoVideoTitle,
} from '../utils/constants';

const HorizontalVideoCard = ({
  specificVideo,
  maxWidth,
  thumbWidth,
  thumbHeight,
}) => {
  const {
    id: { videoId },
    snippet,
  } = specificVideo;

  const views = '403K views'; // 🔧 Placeholder
  const uploadTime = '6 years ago'; // 🔧 Placeholder

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        bgcolor: '#121212',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: maxWidth || '960px',
        mx: 'auto',
        my: 2,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }}>
      {/* Thumbnail */}
      <Box
        sx={{
          height: '200px',
        }}>
        <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
          <CardMedia
            component="img"
            image={snippet?.thumbnails?.high?.url}
            alt={snippet?.title}
            sx={{
              width: thumbWidth || { xs: '100%', sm: 320 },
              height: thumbHeight || { xs: 200, sm: 180 },
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          />
        </Link>
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, px: 3, py: 2 }}>
        {/* Title */}
        <Link
          to={videoId ? `/video/${videoId}` : demoVideoUrl}
          style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            fontWeight="600"
            color="#fff"
            sx={{
              mb: 1,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}>
            {snippet?.title || demoVideoTitle}
          </Typography>
        </Link>

        {/* Channel Info */}
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Link
            to={
              snippet?.channelId
                ? `/channel/${snippet?.channelId}`
                : demoChannelUrl
            }
            style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              color="gray"
              fontWeight="500"
              sx={{ '&:hover': { color: '#aaa' } }}>
              {snippet?.channelTitle || demoChannelTitle}
            </Typography>
          </Link>
          <CheckCircle sx={{ fontSize: 14, color: 'gray' }} />
        </Stack>

        {/* Views + Upload Time */}
        <Typography variant="body2" color="gray" mb={1}>
          {views} • {uploadTime}
        </Typography>

        {/* Description Preview */}
        <Typography
          variant="body2"
          color="gray"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}>
          {snippet?.description || 'No description available...'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HorizontalVideoCard;
