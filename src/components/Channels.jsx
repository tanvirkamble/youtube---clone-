import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ChannelCard from './ChannelCard';
import { fetchAPI } from '../utils';
import ErrorComponent from './ErrorComponent';

const Channels = ({ channels }) => {
  const [enrichedChannels, setEnrichedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    const enrichChannelsWithStats = async () => {
      try {
        const validChannels = (channels || []).filter(
          (c) => c?.id?.channelId && c?.snippet
        );

        if (validChannels.length === 0) {
          setEnrichedChannels([]);
          setLoading(false);
          return;
        }

        const channelIds = validChannels.map((c) => c.id.channelId).join(',');

        const statsRes = await fetchAPI(
          `channels?part=statistics&id=${channelIds}`
        );

        const statsMap = new Map(
          statsRes?.data?.items?.map((item) => [item.id, item.statistics])
        );

        const enriched = validChannels.map((channel) => ({
          ...channel,
          statistics: statsMap.get(channel.id.channelId),
        }));

        setEnrichedChannels(enriched);
      } catch (error) {
        console.error('Failed to enrich channels', error);
        setErrorCode(error?.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };

    enrichChannelsWithStats();
  }, [channels]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorCode) {
    return (
      <ErrorComponent
        errorCode={errorCode}
        msg="Unable to load channels"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!enrichedChannels.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="white">No channels found 🥲</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: 'row',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          py: 1,
          px: 1,
        }}>
        {enrichedChannels.map((channel, idx) => (
          <Box
            key={idx}
            sx={{
              minWidth: '200px',
              maxWidth: '200px',
              flex: '0 0 auto',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#1e1e1e',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: '0.3s',
              cursor: 'pointer',
            }}>
            <ChannelCard channel={channel} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Channels;
