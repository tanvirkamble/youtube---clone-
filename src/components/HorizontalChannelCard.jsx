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
import { demoProfilePicture } from '../utils/constants';

const HorizontalChannelCard = ({ specificChannel }) => {
  const channelId = specificChannel?.id?.channelId;
  const channelTitle = specificChannel?.snippet?.title || 'Channel Name';
  const thumbnail =
    specificChannel?.snippet?.thumbnails?.high?.url || demoProfilePicture;
  const subscribers = specificChannel?.statistics?.subscriberCount;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        bgcolor: '#121212',
        width: '100%',
        maxWidth: '960px',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        mx: 'auto',
        my: 2,
        overflow: 'hidden',
        p: 2,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }}>
      {/* Profile Picture */}
      <Link to={`/channel/${channelId}`}>
        <CardMedia
          component="img"
          image={thumbnail}
          alt={channelTitle}
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            objectFit: 'cover',
            mr: { sm: 3 },
            mb: { xs: 2, sm: 0 },
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Link>

      {/* Channel Info */}
      <CardContent sx={{ color: '#fff', flex: 1, px: 0 }}>
        <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none' }}>
          <Typography variant="h6" fontWeight="bold" color="white">
            {channelTitle}
            <CheckCircle sx={{ fontSize: 16, color: 'gray', ml: 1 }} />
          </Typography>
        </Link>

        {subscribers && (
          <Typography variant="body2" color="gray" mt={0.5}>
            {parseInt(subscribers).toLocaleString()} Subscribers
          </Typography>
        )}

        <Typography variant="body2" color="gray" mt={1}>
          {specificChannel?.snippet?.description?.slice(0, 100) ||
            'No description available...'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HorizontalChannelCard;
