import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

axios.get('https://api.themoviedb.org/3/search/movie', {
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    query: 'Inception',
    language: 'en-US',
    page: 1,
    include_adult: false,
  },
  httpsAgent: agent,
})
  .then(response => {
    console.log('Movie search response:', response.data);
  })
  .catch(error => {
    console.error('Error fetching movie:', error);
  });
