import React from 'react';

import {
  demoChannelTitle,
  demoChannelUrl,
  demoVideoUrl,
  demoVideoTitle,
} from '../utils/constants';

import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const VideoCard = ({
  specificVideo: {
    id: { videoId },
    snippet,
  },
}) => {
  // console.log(snippet?.thumbnail?.high?.url);
  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '358px', md: '320px' },
        boxShadow: 'none',
      }}>
      <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
        <CardMedia
          alt={snippet?.title}
          sx={{
            width: { xs: '100%', sm: '358px', md: '320px' },
            height: 180,
          }}
          image={snippet?.thumbnails?.high?.url}
        />
      </Link>

      <CardContent
        sx={{
          backgroundColor: '#1e1e1e',
          height: '106px',
        }}>
        <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
          <Typography variant="subtitle1" fontWeight="bold" color="#fff">
            {snippet?.title.slice(0, 60) || demoVideoTitle.slice(0, 60)}
          </Typography>
        </Link>
        <Link
          to={
            snippet?.channelId
              ? `/channel/${snippet?.channelId}`
              : demoChannelUrl
          }>
          <Typography variant="subtitle2" fontWeight="bold" color="grey ">
            {snippet?.channelTitle || demoChannelTitle}
            <CheckCircle
              sx={{
                fontSize: 12,
                color: 'grey',
                ml: '5px',
              }}
            />
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
