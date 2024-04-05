require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express();
const port = process.env.PORT || 3000;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

app.use(cors());

// Endpoint to fetch weather data
app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  if (lat && lon && searchQuery) {
    const filteredData = weatherData.filter(location => {
      return (
        location.lat === lat &&
        location.lon === lon &&
        location.city_name.toLowerCase() === searchQuery.toLowerCase()
      );
    });

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
    // Ensure MOVIE_API_KEY is provided
    if (!MOVIE_API_KEY) {
      return res.status(500).json({ message: 'Movie API key not provided.' });
    }

    // Extract necessary location information from request query
    const { lat, lon, searchQuery } = req.query;
    if (!lat || !lon || !searchQuery) {
      return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
    }

    // Make Axios request to The Movie Database API
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: MOVIE_API_KEY,
        query: searchQuery // Search movies based on user provided query
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
