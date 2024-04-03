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
