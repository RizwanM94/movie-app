const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
  console.log("IN SIGNUP")
    const { email, password } = req.body;
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
