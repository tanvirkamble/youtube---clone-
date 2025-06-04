import React from 'react';
import { Stack } from '@mui/material';
import { ChannelCard, VideoCard } from './index';

const Videos = ({ Vid }) => {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="start" gap={2}>
      {Vid.map((item, idx) => {
        if (item.id.videoId) {
          return <VideoCard key={idx} specificVideo={item} />;
        } else if (item.id.channelId) {
          return <ChannelCard key={idx} specificChannel={item} />;
        } else {
          return null;
        }
      })}
    </Stack>
  );
};

export default Videos;
