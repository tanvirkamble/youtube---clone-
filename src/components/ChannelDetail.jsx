import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  ErrorComponent,
  Videos,
  ChannelCard,
  ShortsCard,
  SideBar,
} from './index';
import { fetchAPI, fetchDurationsForVideos } from '../utils';
import useSidebarStore from '../store/sidebarStore';

const ChannelDetail = () => {
  const [specificChannelDetail, setSpecificChannelDetail] = useState(null);
  const [rawVideos, setRawVideos] = useState([]);
  const [enrichedVideos, setEnrichedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const { id } = useParams();
  const setSelectedCategory = useSidebarStore(
    (state) => state.setSelectedCategory
  );

  const fetchChannelAndVideos = async () => {
    setLoading(true);
    setErrorCode(null);
    try {
      const channelRes = await fetchAPI(
        `channels?part=snippet,brandingSettings,statistics&id=${id}`
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
    // 🧼 Clear category when entering channel page
    setSelectedCategory('');
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
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          bgcolor: '#000',
        }}>
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
    <Stack
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#000',
        minHeight: '100vh',
      }}
      p={2}
      gap={2}>
      {/* Sidebar */}
      <Box
        sx={{
          height: { xs: 'auto', md: '100vh' },
          overflowY: 'auto',
          borderRight: { md: '1px solid #3d3d3d' },
          px: { xs: 0, md: 2 },
        }}>
        <SideBar />
        <Typography
          className="copyright"
          variant="body2"
          sx={{
            mt: 1,
            color: '#fff',
            marginLeft: { md: 2 },
            display: { xs: 'none', md: 'block' },
          }}>
          copyright 2025
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 2, overflowY: 'auto', height: '90vh' }}>
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
        <Box display="flex" flexDirection="column" p={5}>
          {/* Shorts */}
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
                    <ShortsCard video={short} allShorts={shorts} />
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
    </Stack>
  );
};

export default ChannelDetail;
