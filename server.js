// server.js
require('dotenv').config();
const express = require('express');
const weatherData = require('./data/weather.json');

const app = express();
const port = process.env.PORT || 3000;
const mapApiKey = process.env.VITE_MAP_KEY; // Accessing mapApiKey from environment variables

// Define routes...


// Define the Forecast class
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Please provide lat and lon parameters.' });
  }

  try {
    const weatherData = await fetchWeatherData(lat, lon);
    const forecasts = processWeatherData(weatherData);
    res.json({ forecasts });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define the function to fetch weather data
async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(`https://api.example.com/weather?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  } catch (error) {
    console.error('Error connecting to the weather API:', error);
    throw error;
  }
}
