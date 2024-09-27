const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String, // Storing image as a URL
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the movie
    ref: 'User',
    required: true,  // Assuming you require user authentication
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
