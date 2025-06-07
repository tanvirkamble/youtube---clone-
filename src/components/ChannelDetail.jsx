import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ErrorComponent, Videos, ChannelCard } from './index';
import { fetchAPI } from '../utils/fetchAPI';

const ChannelDetail = () => {
  const [specificChannelDetail, setspecificChannelDetail] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const { id } = useParams();

  const fetchChannelAndVideos = async () => {
    setLoading(true);
    setErrorCode(null);

    // const channelRes = await fetchAPI(`channels?part=snippet&id=${id}`);
    const channelRes = await fetchAPI(
      `channels?part=snippet,brandingSettings&id=${id}`
    );
    const videosRes = await fetchAPI(
      `search?channelId=${id}&part=snippet&order=date`
    );

    if (channelRes.errorCode || videosRes.errorCode) {
      console.log('eror detected');
      setErrorCode(channelRes.errorCode || videosRes.errorCode);
    } else {
      // console.log('specificChannelDetail', channelRes.data?.items?.[0]);
      setspecificChannelDetail(channelRes.data?.items?.[0] || null);
      setChannelVideos(videosRes.data?.items || []);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchChannelAndVideos();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
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
        msg={`You trying to fetch channel details`}
      />
    );
  }

  return (
    <Box minHeight={'95vh'} bgcolor={'#000'}>
      <Box>
        <div
          style={{
            backgroundImage: specificChannelDetail?.brandingSettings?.image
              ?.bannerExternalUrl
              ? `url(${specificChannelDetail.brandingSettings.image.bannerExternalUrl})`
              : 'linear-gradient(to right, #000000, #1a1a1a)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 10,
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
      <Box display={'flex'} p={2}>
        <Box sx={{ mr: { sm: '27%', md: '10%' } }} />
        <Videos Vid={channelVideos} />
      </Box>
    </Box>
  );
};

export default ChannelDetail;
