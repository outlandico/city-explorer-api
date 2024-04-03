// Import required modules
const express = require('express');
const weatherData = require('./data/weather.json');
const Forecast = require('./Forecast'); // Import the Forecast class

// Create an instance of Express app
const app = express();

// Define the port
const port = process.env.PORT || 3000;

// Define routes
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
      // Array to store Forecast objects
      const forecasts = [];

      // Loop through each day's data
      filteredData[0].data.forEach(item => {
        // Extract relevant information for each day and create a new Forecast object
        const forecast = new Forecast(
          item.valid_date,
          item.weather.description,
          item.temp,
          item.min_temp,
          item.max_temp,
          item.rh,
          item.wind_spd
        );
        
        // Push the forecast object to the forecasts array
        forecasts.push(forecast);
      });

      // Send the array of Forecast objects as the response
      res.json(forecasts);
    } else {
      res.status(404).json({ message: 'No weather data found for the specified location and search query.' });
    }
  } else {
    res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Assuming you have retrieved the `lat` and `lon` values from the city search response
const lat = 40.7128; // Example latitude
const lon = -74.0060; // Example longitude

// Make a new request to the server's /weather endpoint
fetch(`/weather?lat=${lat}&lon=${lon}`)
  .then(response => {
    // Check if the response is successful
    if (response.ok) {
      // Parse the JSON response
      return response.json();
    } else {
      // Handle error if the response is not successful
      throw new Error('Failed to fetch weather data');
    }
  })
  .then(weatherData => {
    // Handle the weather data received from the server
    console.log(weatherData);
    // You can do further processing with the weather data here
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching weather data:', error);
  });
