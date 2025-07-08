import React from 'react';
import { Stack, Typography } from '@mui/material';
import {
  VideoCard,
  ChannelCard,
  HorizontalChannelCard,
  HorizontalVideoCard,
  ShortsCard,
} from './index';

const Videos = ({
  Vid,
  direction = 'row',
  maxWidth,
  thumbWidth,
  thumbHeight,
}) => {
  if (!Vid?.length) {
    return (
      <Typography variant="h4" sx={{ color: 'white' }}>
        No videos found
      </Typography>
    );
  }

  const isHorizontal = direction === 'horizontal';

  return isHorizontal ? (
    <Stack direction="column" gap={3} sx={{ width: '100%' }}>
      {Vid.map((item, idx) => {
        if (item?.isShort) return null; // ❌ Skip shorts if already rendered
        if (item.id.videoId) {
          return (
            <HorizontalVideoCard
              key={idx}
              specificVideo={item}
              maxWidth={maxWidth}
              thumbHeight={thumbHeight}
              thumbWidth={thumbWidth}
            />
          );
        } else if (item.id.channelId) {
          return (
            <HorizontalChannelCard
              key={idx}
              specificChannel={item}
              maxWidth={maxWidth}
              thumbHeight={thumbHeight}
              thumbWidth={thumbWidth}
            />
          );
        }
        return null;
      })}
    </Stack>
  ) : (
    <Stack direction="row" flexWrap="wrap" justifyContent="start" gap={2}>
      {Vid.map((item, idx) => {
        if (item?.isShort) return null;
        if (item.id.videoId) {
          return <VideoCard key={idx} specificVideo={item} />;
        } else if (item.id.channelId) {
          return <ChannelCard key={idx} specificChannel={item} />;
        }
        return null;
      })}
    </Stack>
  );
};

export default Videos;
