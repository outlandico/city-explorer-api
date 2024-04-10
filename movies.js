const axios = require('axios');
const Movie = require('./Movie');

// Function to fetch movie data
async function fetchMovieData(apiKey, searchQuery) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: apiKey,
        query: searchQuery
      }
    });

    const movies = response.data.results.map(movie => new Movie(
      movie.title,
      movie.overview,
      movie.vote_average,
      movie.vote_count,
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      movie.popularity,
      movie.release_date
    ));

    return movies;
  } catch (error) {
    console.error('Error fetching movie data:', error);
    throw error;
  }
}

module.exports = {
  fetchMovieData
};
