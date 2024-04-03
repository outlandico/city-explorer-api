class Forecast {
    constructor(date, description) {
      this.date = date;
      this.description = description;
    }
  }
  
  module.exports = Forecast; // Export the Forecast class to be used in other files


  const express = require('express');
const weatherData = require('./data/weather.json');

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Require the Forecast class from the Forecast.js file
const Forecast = require('./Forecast');

// Create a new instance of Forecast
const todayForecast = new Forecast('2024-04-02', 'Partly cloudy');

// Access the properties of the Forecast instance
console.log(todayForecast.date); // Output: 2024-04-02
console.log(todayForecast.description); // Output: Partly cloudy
