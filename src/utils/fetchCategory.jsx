import { fetchAPI } from './fetchAPI';

/**
 * Fetches both videos and channels for a given search category using the YouTube Data API.
 * This includes:
 * - Videos (type=video)
 * - Channels (type=channel)
 *
 * @param {string} category - The category or search query (e.g., "New", "React", "Fitness").
 * @returns {Promise<{ videos: Array, channels: Array }>} Object containing both videos and channels.
 */
const fetchCategory = async (category = 'New') => {
  try {
    const [videoRes, channelRes] = await Promise.all([
      fetchAPI(`search?part=snippet&q=${category}&type=video&maxResults=25`),
      fetchAPI(`search?part=snippet&q=${category}&type=channel&maxResults=10`),
    ]);

    return {
      videos: videoRes?.data?.items || [],
      channels: channelRes?.data?.items || [],
    };
  } catch (err) {
    console.error(
      `❌ Error fetching videos/channels for category: ${category}`,
      err
    );
    return {
      videos: [],
      channels: [],
    };
  }
};

export default fetchCategory;
