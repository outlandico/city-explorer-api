// Initialize an empty object to serve as the cache
const cache = {};

// Function to set a value in the cache
function setCache(key, value) {
  cache[key] = value;
}

// Function to get a value from the cache
function getCache(key) {
  return cache[key];
}

// Function to clear a value from the cache
function clearCache(key) {
  delete cache[key];
}

// Export the cache functions to make them available to other modules
module.exports = { setCache, getCache, clearCache };



const { setCache, getCache, clearCache } = require('./cache');
