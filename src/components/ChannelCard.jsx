import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants';
import { CheckCircle } from '@mui/icons-material';
import { ChannelDetail } from '.';

const ChannelCard = ({ specificChannel, marginTop }) => {
  return (
    <Card
      sx={{
        BoxShadow: 'none',
        bgcolor: 'transparent',
        width: { xs: '100%', sm: '338px', md: '300px' },
        marginTop,
      }}>
      <Link
        to={`/channel/${specificChannel?.id?.channelId}`}
        style={{ textDecoration: 'none' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
          }}>
          <CardMedia
            component={'img'}
            image={
              specificChannel?.snippet?.thumbnails?.high?.url ||
              demoProfilePicture
            }
            alt={specificChannel?.snippet?.title}
            sx={{
              borderRadius: '50%',
              height: '180px',
              width: '180px',
              mx: 'auto', // Center horizontally
              mb: 2,
              border: '1px solid #e3e3e3',
            }}
          />
          <Typography variant="h6">
            {specificChannel?.snippet?.title || 'Channel Name'}
            <CheckCircle sx={{ fontSize: 14, color: 'gray', ml: '5px' }} />
          </Typography>
          {specificChannel?.statistics?.subscriberCount && (
            <Typography variant="subtitle1" color="gray">
              {parseInt(specificChannel?.statistics?.subscriberCount)
                .toLocaleString()
                .replace(/,/g, ' ')}{' '}
              Subscribers
            </Typography>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default ChannelCard;
