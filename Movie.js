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
  // movie export test-wasn't sure if it is correctly acp'ing"
  module.exports = Movie;
  