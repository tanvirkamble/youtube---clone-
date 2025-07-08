import { fetchAPI } from './fetchAPI';

// helper: converts ISO 8601 → seconds
// fetchDurations.jsx
export const parseDuration = (isoDuration) => {
  if (!isoDuration || typeof isoDuration !== 'string') return '0:00';

  const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

  const match = isoDuration.match(durationRegex);
  if (!match) return '0:00';

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  const totalMinutes = hours * 60 + minutes;
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${totalMinutes}:${paddedSeconds}`;
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
        const duration = item?.contentDetails?.duration;

        if (!duration || typeof duration !== 'string') return; // 🛡 skip invalid durations

        const secondsStr = parseDuration(duration);
        const [minStr, secStr] = secondsStr.split(':');
        const totalSeconds = parseInt(minStr) * 60 + parseInt(secStr);

        map.set(item.id, {
          seconds: totalSeconds,
          duration,
          isShort: totalSeconds <= 60,
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
