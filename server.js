// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express();
const port = process.env.PORT || 3000;
const mapApiKey = process.env.VITE_MAP_KEY; // Accessing mapApiKey from environment variables
const WEATHER_KEY = process.env.WEATHER_KEY
// Define routes...
app.use(cors())


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

app.get('/weather', async (req, res) => {
  // const { lat, lon } = req.query;
  const {city} = req.query
  if (!city) {
    return res.status(400).json({ message: 'Please provide lat and lon parameters.' });
  }

  try {
    const weatherData = await fetchWeatherData(city);
    const forecasts = weatherData;
    // const forecasts = processWeatherData(weatherData);
res.status(200).json(forecasts)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Define the function to fetch weather data
async function fetchWeatherData(city) {
  try {
    
    const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&city=${city}&days=5`);
   return response.data.data.map(day=>new Forecast(day))
   
      // description:response.data.weather.description
    
  } catch (error) {
    console.error('Error connecting to the weather API:', error);
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
