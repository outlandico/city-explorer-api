require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express();
const port = process.env.PORT || 3000;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

// Define a cache object to store movie data
const movieCache = {};

// Function to fetch movie data from the cache or external API
const fetchMovieData = async (searchQuery) => {
  try {
    // Check if movie data for the search query exists in the cache
    if (movieCache[searchQuery]) {
      console.log(`Movie data for "${searchQuery}" found in cache`);
      return movieCache[searchQuery];
    }

    // Fetch movie data from the external API
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: MOVIE_API_KEY,
        query: searchQuery
      }
    });

    // Extract movie data from the response
    const movies = response.data.results.map(movie => ({
      title: movie.title,
      overview: movie.overview,
      average_votes: movie.vote_average,
      total_votes: movie.vote_count,
      image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      popularity: movie.popularity,
      released_on: movie.release_date
    }));

    // Store movie data in the cache
    movieCache[searchQuery] = movies;

    console.log(`Movie data for "${searchQuery}" fetched from external API`);
    return movies;
  } catch (error) {
    console.error(`Error fetching movie data for "${searchQuery}":`, error);
    throw new Error('Failed to fetch movie data');
  }
};

app.use(cors());

// Endpoint to fetch weather data
app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  if (lat && lon && searchQuery) {
    const filteredData = weatherData.filter(location => (
      location.lat === lat &&
      location.lon === lon &&
      location.city_name.toLowerCase() === searchQuery.toLowerCase()
    ));

    if (filteredData.length > 0) {
      res.json(filteredData);
    } else {
      res.status(404).json({ message: 'No weather data found for the specified location and search query.' });
    }
  } else {
    res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
  }
});

// Endpoint to fetch movie data
app.get('/movies', async (req, res) => {
  try {
    // Extract necessary location information from request query
    const { lat, lon, searchQuery } = req.query;
    if (!lat || !lon || !searchQuery) {
      return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
    }

    // Fetch movie data
    const movies = await fetchMovieData(searchQuery);

    // Send movie data as response
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
