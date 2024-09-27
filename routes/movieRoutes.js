const express = require('express');
const { createMovie, updateMovie, getMovies, getMovieById } = require('../controllers/movieController');
const router = express.Router();


router.post('/create', createMovie);
router.put('/:id', updateMovie);
router.get('/', getMovies);
router.get('/:id', getMovieById);

module.exports = router;
