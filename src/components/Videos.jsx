import React from 'react';
import { Stack, Typography } from '@mui/material';
import { ChannelCard, VideoCard } from './index';

const Videos = ({ Vid, direction }) => {
  if (!Vid?.length) {
    return (
      <Typography variant="h4" sx={{ color: 'white' }}>
        No videos found
      </Typography>
    );
  }

  return (
    <Stack
      direction={direction || 'row'}
      flexWrap="wrap"
      justifyContent="start"
      gap={2}>
      {Vid.map((item, idx) => {
        if (item.id.videoId) {
          {
            /* console.log('videoCard', item); */
          }
          return <VideoCard key={idx} specificVideo={item} />;
        } else if (item.id.channelId) {
          {
            /* console.log('ChannelCard', item); */
          }
          return <ChannelCard key={idx} specificChannel={item} />;
        } else {
          return null;
        }
      })}
    </Stack>
  );
};

export default Videos;
