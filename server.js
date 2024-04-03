const express = require('express');
const weatherData = require('./data/weather.json');

// Dynamic import of node-fetch
import('node-fetch')
  .then(module => {
    const fetch = module.default;

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

    app.get('/weather', async (req, res) => {
      const { lat, lon, searchQuery } = req.query;

      // Check if lat, lon, and searchQuery are provided
      if (!lat || !lon || !searchQuery) {
        return res.status(400).json({ message: 'Please provide lat, lon, and searchQuery parameters.' });
      }

      // Your existing code for filtering weather data

      try {
        // Make API call using makeApiCall function
        const apiResponse = await makeApiCall();

        // Handle API response
        handleApiResponse(apiResponse);

        // Your existing code for sending the response
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' }); // Sending status 500 and error message
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Define the makeApiCall function
    async function makeApiCall() {
      try {
        const response = await fetch("https://api.example.com");
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('HTTP Error: ' + response.status);
        }
      } catch (error) {
        console.error('Error connecting to the API:', error);
        throw error; // Rethrow the error
      }
    }

    // Define the handleApiResponse function
    function handleApiResponse(response) {
      if (response != null) {
        try {
          console.log("API Response:", response);
          // Process the response here
        } catch (error) {
          console.error("Error decoding JSON response:", error);
        }
      }
    }
  })
  .catch(error => {
    console.error('Error importing node-fetch:', error);
  });


// Change this line
// const fetch = require('node-fetch');

// To this
import('node-fetch').then(module => {
    const fetch = module.default;
    // Your server code that uses fetch goes here
  }).catch(error => {
    console.error('Error importing node-fetch:', error);
  });
  