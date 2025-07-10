import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchComments = async (videoId) => {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads`;
  try {
    const { data } = await axios.get(url, {
      params: {
        part: 'snippet',
        videoId,
        maxResults: 50,
        key: API_KEY,
      },
    });

    return data.items.map((item) => ({
      id: item.id,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  }
};
