import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovies(query) {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: query
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        return [];
    }
}
