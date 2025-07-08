import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ErrorComponent, Videos, ChannelCard, ShortsCard } from './index';
import { fetchAPI } from '../utils/fetchAPI';
import { fetchDurationsForVideos } from '../utils/fetchDurations';

const ChannelDetail = () => {
  const [specificChannelDetail, setSpecificChannelDetail] = useState(null);
  const [rawVideos, setRawVideos] = useState([]);
  const [enrichedVideos, setEnrichedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const { id } = useParams();

  const fetchChannelAndVideos = async () => {
    setLoading(true);
    setErrorCode(null);
    try {
      const channelRes = await fetchAPI(
        `channels?part=snippet,brandingSettings&id=${id}`
      );
      const videosRes = await fetchAPI(
        `search?channelId=${id}&part=snippet&order=date`
      );

      if (channelRes.errorCode || videosRes.errorCode) {
        setErrorCode(channelRes.errorCode || videosRes.errorCode);
      } else {
        setSpecificChannelDetail(channelRes.data?.items?.[0] || null);
        setRawVideos(videosRes.data?.items || []);
      }
    } catch (error) {
      setErrorCode(error?.response?.status || 500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelAndVideos();
  }, [id]);

  useEffect(() => {
    const enrich = async () => {
      if (!rawVideos.length) return setEnrichedVideos([]);

      const valid = rawVideos.filter((v) => v?.id?.videoId);
      if (!valid.length) return setEnrichedVideos([]);

      const enriched = await fetchDurationsForVideos(valid);
      setEnrichedVideos(enriched);
    };
    enrich();
  }, [rawVideos]);

  const shorts = enrichedVideos.filter((v) => v?.isShort);
  const mainVideos = enrichedVideos.filter((v) => !v?.isShort);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorCode) {
    return (
      <ErrorComponent
        errorCode={errorCode}
        onRetry={fetchChannelAndVideos}
        msg="Trying to fetch channel details"
      />
    );
  }

  return (
    <Box minHeight="95vh" bgcolor="#000">
      {/* Channel Banner */}
      <Box>
        <div
          style={{
            backgroundImage: specificChannelDetail?.brandingSettings?.image
              ?.bannerExternalUrl
              ? `url(${specificChannelDetail.brandingSettings.image.bannerExternalUrl})`
              : 'linear-gradient(to right, #000000, #1a1a1a)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '300px',
          }}
        />
        <Box display="flex" justifyContent="center">
          <ChannelCard
            specificChannel={specificChannelDetail}
            marginTop="-110px"
          />
        </Box>
      </Box>

      {/* Shorts and Videos */}
      <Box display="flex" flexDirection="column" p={10}>
        {/* Shorts Section */}
        {shorts.length > 0 && (
          <Box sx={{ width: '100%', mb: 5 }}>
            <Typography variant="h5" color="white" mb={2} fontWeight="bold">
              Shorts
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                pb: 1,
              }}>
              {shorts.map((short, idx) => (
                <Box
                  key={idx}
                  sx={{
                    minWidth: '180px',
                    maxWidth: '180px',
                    flex: '0 0 auto',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: '#1e1e1e',
                  }}>
                  <ShortsCard video={short} />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Main Videos */}
        <Typography variant="h5" color="white" mb={2} fontWeight="bold">
          Videos
        </Typography>
        <Videos Vid={mainVideos} />
      </Box>
    </Box>
  );
};

export default ChannelDetail;
