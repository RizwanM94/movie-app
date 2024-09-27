const Movie = require('../models/movieModel');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/*checking upload directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}*/

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
    //cb(null, path.join(__dirname, './uploads')); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});

const upload = multer({ storage: storage }).single('image'); // 'image' is the form field name

// GET ALL
exports.getMovies = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the request object

    // Retrieve only the movies created by the logged-in user
    const movies = await Movie.find({ userId: userId }); 

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// ADD A MOVIE
exports.createMovie = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { title, year } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // Get image URL if uploaded

    // Validation
    if (!title || !year) {
      return res.status(400).json({ message: 'Title and Year are required' });
    }

    try {
      const newMovie = new Movie({
        title,
        year,
        imageUrl, // Store image URL in the database
        userId: req.user.id, // Assuming userId is being passed in req.user
      });

      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// EDIT OR UPDATE MOVIE
exports.updateMovie = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { title, year } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // Get new image URL if uploaded

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      // Authorization check (only the creator can update)
      if (movie.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this movie' });
      }

      // Only update fields if they are provided
      movie.title = title || movie.title;
      movie.year = year || movie.year;
      movie.imageUrl = imageUrl || movie.imageUrl; // Update imageUrl only if a new image is uploaded

      const updatedMovie = await movie.save();
      res.status(200).json(updatedMovie);
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// GET MOVIE BY ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); // Find movie by ID
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


/*const Movie = require('../models/movieModel');
const multer = require('multer');

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 'uploads/' directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique file name
  },
});

const upload = multer({ storage: storage }).single('image'); // 'image' is the form field name

// GET ALL MOVIES
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find(); // Retrieve all movies from the database
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD A MOVIE
exports.createMovie = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { title, year } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get image URL if uploaded

    try {
      const newMovie = new Movie({
        title,
        year,
        imageUrl, // Store image URL in the database
        userId: req.user.id, // Assuming userId is being passed in req.user
      });

      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// EDIT OR UPDATE MOVIE
exports.updateMovie = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { title, year } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get new image URL if uploaded

    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      movie.title = title || movie.title;
      movie.year = year || movie.year;
      movie.imageUrl = imageUrl || movie.imageUrl; // Update imageUrl only if a new image is uploaded

      const updatedMovie = await movie.save();
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};*/
