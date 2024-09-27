const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5001', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Routes
app.use('/api/user', userRoutes); // for sign in, signup
app.use('/api/movies', authMiddleware, movieRoutes); // for movie actions (add, edit, etc.)

// DB connection
mongoose.connect(process.env.MONGO_URI, {  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
