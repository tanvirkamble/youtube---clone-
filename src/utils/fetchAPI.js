// import axios from 'axios';
// const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

// const options = {
//   method: 'GET',
//   // url: BASE_URL,
//   params: {
//     maxResults: '50',
//   },
//   headers: {
//     'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
//     'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
//   },
// };

// export const fetchAPI = async (url) => {
//   const { data } = await axios.get(`${BASE_URL}/${url}`, options);

//   return data;
// };
import axios from 'axios';

const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {
  method: 'GET',
  params: {
    maxResults: '50',
  },
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
    'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
  },
};

export const fetchAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return { data }; // Return in expected shape
  } catch (error) {
    console.error('fetchAPI error:', error);
    return {
      errorCode: error?.response?.status || 500,
      errorMsg: error?.message || 'Unknown error',
    };
  }
};
