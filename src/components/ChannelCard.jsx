import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants';
import { CheckCircle } from '@mui/icons-material';

const ChannelCard = ({ specificChannel }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        BoxShadow: 'none',
        // borderRadius: '20px',
        bgcolor: '#1e1e1e',
        width: { xs: '100%', sm: '358px', md: '320px' },
      }}>
      <Link
        to={`/specificChannel?.id?.channelId`}
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
