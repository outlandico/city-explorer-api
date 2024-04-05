// Movie.js

class Movie {
    constructor(title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
      this.title = title;
      this.overview = overview;
      this.averageVotes = averageVotes;
      this.totalVotes = totalVotes;
      this.imageUrl = imageUrl;
      this.popularity = popularity;
      this.releasedOn = releasedOn;
    }
  }
  
  module.exports = Movie;
  