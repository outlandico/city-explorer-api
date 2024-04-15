require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Movie = require('./Movie'); // Import the Movie class


const app = express();
const port = process.env.PORT || 3007;


// Use CORS middleware
app.use(cors());

// Define the Forecast class
class Forecast {
  constructor(weatherData) {
    this.date = weatherData.datetime;
    this.description = weatherData.weather.description;
  }
}

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Endpoint to fetch weather data
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'Please provide a city parameter.' });
  }

  try {
    const weatherData = await fetchWeatherData(city);
    const forecasts = weatherData.map(day => new Forecast(day));
    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch movie data
app.get('/movies', async (req, res) => {
  try {
    // Ensure MOVIE_API_KEY is provided
    if (!process.env.MOVIE_API_KEY) {
      return res.status(500).json({ message: 'Movie API key not provided.' });
    }

    // Extract necessary location information from request query
    // const { lat, lon, searchQuery } = req.query;
    // if (!lat || !lon || !searchQuery) {
    //   return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
    // }
    const { searchQuery } = req.query;
    // if (!searchQuery) {
    //   return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
    // }

    // Make Axios request to The Movie Database API
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: process.env.MOVIE_API_KEY,
        // lat,
        // lon,
        query: searchQuery
      }
    });

    // Extract movie data from the response
    const movies = response.data.results.map(movie => new Movie(
      movie.title,
      movie.overview,
      movie.vote_average,
      movie.vote_count,
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      movie.popularity,
      movie.release_date
    ));

    // Send movie data as response
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define the function to fetch weather data
async function fetchWeatherData(city) {
  try {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&city=${city}&days=5`);
    return response.data.data;
  } catch (error) {
    console.error('Error connecting to the weather API:', error);
    throw error;
  }
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
