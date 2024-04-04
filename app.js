const express = require('express');
const weatherData = require('./data/weather.json');
const cors = require('cors');

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  // Validate lat, lon, and searchQuery
  if (!lat || !lon || !searchQuery) {
    return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
  }

  // Find weather data based on lat, lon, and searchQuery
  const filteredData = weatherData.filter(location => {
    return (
      location.lat === lat &&
      location.lon === lon &&
      location.city_name.toLowerCase() === searchQuery.toLowerCase()
    );
  });

  if (filteredData.length === 0) {
    return res.status(404).json({ message: 'No weather data found for the specified location and search query.' });
  }

  // Extract forecasts from filtered data
  const forecasts = filteredData[0].data.map(item => new Forecast(item.valid_date, item.weather.description));
  res.json(forecasts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
