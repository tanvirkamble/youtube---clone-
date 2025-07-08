import { fetchAPI } from './fetchAPI';

/**
 * Fetches basic video search results for a given category.
 * Uses the YouTube Data API's `search` endpoint to get video metadata (but not duration).
 * @param {string} category - The category or search query (e.g., "New", "Music", "JavaScript tutorials").
 * @returns {Promise<Array>} List of raw video objects from the YouTube API.
 */
export const fetchCategory = async (category = 'New') => {
  try {
    const response = await fetchAPI(`search?part=snippet&q=${category}`);
    return response?.data?.items || [];
  } catch (err) {
    console.error(
      `❌ Error fetching search results for category: ${category}`,
      err
    );
    return [];
  }
};
