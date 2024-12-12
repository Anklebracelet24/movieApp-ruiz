const Movie = require("../models/Movie");

// Add a new movie (Admin only)
// Import the Movie model

// Add Movie function
module.exports.addMovie = async (req, res) => {
  try {
    // Destructure the request body
    const { title, director, year, description, genre } = req.body;

    // Validate the request body
    if (!title || !director || !year || !description || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new movie
    const movie = new Movie({
      title,
      director,
      year,
      description,
      genre,
    });

    // Save the movie to the database
    await movie.save();

    // Return the newly created movie
    res.status(201).json(movie);
  } catch (error) {
    // Return an error message if something goes wrong
    res.status(500).json({ message: "Failed to add movie" });
  }
};

// Get all movies (Accessible by all authenticated users)
// Get Movies function
module.exports.getAllMovies = async (req, res) => {
  try {
    // Retrieve all movies from the database
    const movies = await Movie.find();

    // Return the movies in the response
    res.status(200).json({ movies });
  } catch (error) {
    // Return an error message if something goes wrong
    res.status(500).json({ message: "Failed to retrieve movies" });
  }
};

// Get Movie by ID function
module.exports.getMovieById = async (req, res) => {
  try {
    // Get the movie ID from the request parameters
    const movieId = req.params.id;

    // Retrieve the movie from the database
    const movie = await Movie.findById(movieId);

    // If the movie is not found, return a 404 error
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    // Return the movie in the response
    res.status(200).json(movie);
  } catch (error) {
    // Return an error message if something goes wrong
    res.status(500).json({ message: "Failed to retrieve movie" });
  }
};

// Update Movie
module.exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    // Retrieve the movie from the database
    const movie = await Movie.findById(movieId);

    // If the movie is not found, return a 404 error
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Update the movie with the new data from req.body
    const updatedData = {
      title: req.body.title || movie.title,
      director: req.body.director || movie.director,
      year: req.body.year || movie.year,
      description: req.body.description || movie.description,
      genre: req.body.genre || movie.genre,
    };

    // Check if at least one field is provided for update
    if (
      !updatedData.title &&
      !updatedData.director &&
      !updatedData.year &&
      !updatedData.description &&
      !updatedData.genre
    ) {
      return res.status(400).json({
        message: "At least one field must be provided to update the movie.",
      });
    }

    // Update the movie
    Object.assign(movie, updatedData);

    // Save the updated movie to the database
    const savedMovie = await movie.save();

    // Send a successful response with the updated movie
    return res.status(200).json({
      message: "Movie updated successfully",
      updatedMovie: savedMovie,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error); // Log the error details

    // Return an error message with a general failure message
    return res.status(500).json({
      message: "Failed to update movie: " + error.message,
    });
  }
};

// Delete Movie function
module.exports.deleteMovie = async (req, res) => {
  try {
    // Get the movie ID from the request parameters
    const movieId = req.params.id;

    // Delete the movie from the database
    await Movie.deleteOne({ _id: movieId });

    // Return a success message
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    // Return a detailed error message
    res.status(500).json({
      message: "Failed to delete movie",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Modified addComment function to work with PATCH route
module.exports.addMovieComment = async (req, res) => {
  try {
    const movieId = req.params.id;
    const { userId, comment } = req.body;

    // Find the movie by ID
    const movie = await Movie.findById(movieId);

    // If the movie doesn't exist, return a 404
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Add the new comment to the movie's comments array
    movie.comments.push({ userId, comment });

    // Save the updated movie document
    const updatedMovie = await movie.save();

    // Return the updated movie with status 200
    return res.status(200).json({
      message: "Comment added successfully",
      updatedMovie,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while adding the comment." });
  }
};

module.exports.getMovieComments = async (req, res) => {
  const movieId = req.params.id; // Use the 'id' from the route parameter

  try {
    // Find the movie by its ID
    const movie = await Movie.findById(movieId);

    // If the movie is not found, return a 404 error
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Map the movie comments to the desired output format
    const comments = movie.comments.map((comment) => ({
      userId: comment.userId, // The userId of the person who commented
      comment: comment.comment, // The actual comment text
      _id: comment._id, // The unique ID of the comment
    }));

    // Return the comments in the expected format
    res.json({
      comments: comments, // The response will be wrapped in a 'comments' key
    });
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ message: error.message });
  }
};
