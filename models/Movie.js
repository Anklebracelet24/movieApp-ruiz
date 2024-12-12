// Import Mongoose
const mongoose = require("mongoose");

// Define the movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

// Create the movie model
const Movie = mongoose.model("Movie", movieSchema);

// Export the movie model
module.exports = Movie;
