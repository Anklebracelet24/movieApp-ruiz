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
    // Get the movie ID from the request parameters
    const movieId = req.params.id;

    // Retrieve the movie from the database
    const movie = await Movie.findById(movieId);

    // If the movie is not found, return a 404 error
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    // Update the movie with the new data
    movie.title = req.body.title || movie.title;
    movie.director = req.body.director || movie.director;
    movie.year = req.body.year || movie.year;
    movie.description = req.body.description || movie.description;
    movie.genre = req.body.genre || movie.genre;

    // Save the updated movie to the database
    await movie.save();

    // Return a success message with the updated movie
    res.status(200).json({
      message: "Movie updated successfully",
      updatedMovie: movie,
    });
  } catch (error) {
    // Return an error message if something goes wrong
    res.status(500).json({ message: "Failed to update movie" });
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
  const { id } = req.params; // Movie ID from URL
  const { userId, comment } = req.body; // Comment and User ID from the body

  // Validate that userId and comment are present
  if (!userId || !comment) {
    return res
      .status(400)
      .json({ message: "User ID and comment are required" });
  }

  try {
    // Find the movie by ID
    const movie = await Movie.findById(id);

    // Check if the movie exists
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie with the given ID does not exist" });
    }

    // Add or update the comment
    const newComment = { userId, comment };

    // Check if the user has already commented on this movie
    const existingCommentIndex = movie.comments.findIndex(
      (commentObj) => commentObj.userId.toString() === userId.toString()
    );

    if (existingCommentIndex > -1) {
      // If the user has already commented, update the comment
      movie.comments[existingCommentIndex].comment = comment;
    } else {
      // Otherwise, add a new comment
      movie.comments.push(newComment);
    }

    // Save the updated movie document
    const updatedMovie = await movie.save();

    // Return the updated movie and a success message
    return res.status(200).json({
      message: "comment added successfully",
      updatedMovie,
    });
  } catch (error) {
    // Handle any other errors that might occur
    return res
      .status(500)
      .json({ message: `An error occurred: ${error.message}` });
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
