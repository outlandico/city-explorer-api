// weather.js

const axios = require('axios');

// Define the function to fetch weather data
async function fetchWeatherData(city, weatherKey) {
  try {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherKey}&city=${city}&days=5`);
    return response.data.data;
  } catch (error) {
    console.error('Error connecting to the weather API:', error);
    throw error;
  }
}

module.exports = {
  fetchWeatherData
};
