const express = require('express');
const weatherData = require('./data/weather.json');

// Define the Forecast class
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const app = express();
const port = process.env.PORT || 3000;

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

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
      const forecasts = filteredData[0].data.map(item => new Forecast(item.valid_date, item.weather.description));
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


