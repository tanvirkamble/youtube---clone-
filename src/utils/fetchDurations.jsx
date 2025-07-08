import { fetchAPI } from './fetchAPI';

// helper: converts ISO 8601 → seconds
const parseDuration = (iso) => {
  const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const minutes = parseInt(match?.[1] || '0', 10);
  const seconds = parseInt(match?.[2] || '0', 10);
  return minutes * 60 + seconds;
};

export const fetchDurationsForVideos = async (videoList = []) => {
  const validVideos = videoList.filter(
    (v) => v.id?.kind === 'youtube#video' && v.id?.videoId
  );

  const videoIdChunks = [];
  for (let i = 0; i < validVideos.length; i += 50) {
    const chunk = validVideos.slice(i, i + 50);
    videoIdChunks.push(chunk.map((v) => v.id.videoId).join(','));
  }

  const enriched = [];

  for (const chunk of videoIdChunks) {
    try {
      const res = await fetchAPI(`videos?part=contentDetails&id=${chunk}`);
      const map = new Map();

      res?.data?.items?.forEach((item) => {
        const duration = item.contentDetails?.duration;
        const seconds = parseDuration(duration);
        map.set(item.id, {
          seconds,
          duration,
          isShort: seconds <= 60,
        });
      });

      validVideos.forEach((video) => {
        const id = video.id.videoId;
        if (map.has(id)) {
          enriched.push({ ...video, ...map.get(id) });
        }
      });
    } catch (err) {
      console.error('❌ Error fetching durations chunk:', err);
    }
  }

  console.log('📦 Enriched videos with duration + shorts info:', enriched);
  return enriched;
};
