require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Movie = require('./Movie'); // Import the Movie class
const { fetchWeatherData } = require('./weather'); // Import the fetchWeatherData function
const { fetchMovieData } = require('./movies'); // Import the fetchMovieData function


const app = express();
const port = process.env.PORT || 3007;

// Use CORS middleware
app.use(cors());

// Define the Forecast class (remains unchanged)
class Forecast {
  constructor(weatherData) {
    this.date = weatherData.datetime;
    this.description = weatherData.weather.description;
  }
}

// Define routes (remains unchanged)
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Endpoint to fetch weather data (remains unchanged)
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'Please provide a city parameter.' });
  }

  try {
    const weatherData = await fetchWeatherData(city, process.env.WEATHER_KEY);
    const forecasts = weatherData.map(day => new Forecast(day));
    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch movie data (using fetchMovieData function from movies.js)
app.get('/movies', async (req, res) => {
  try {
    // Ensure MOVIE_API_KEY is provided (remains unchanged)
    if (!process.env.MOVIE_API_KEY) {
      return res.status(500).json({ message: 'Movie API key not provided.' });
    }

    const { searchQuery } = req.query;

    // Fetch movie data using the exported function from movies.js
    const movies = await fetchMovieData(process.env.MOVIE_API_KEY, searchQuery);

    // Send movie data as response
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server (remains unchanged)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
