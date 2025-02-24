const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Use a secure secret in production

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ✅ FIXED: Removed email validation
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // ✅ Correct email validation
  },
  phone: { 
    type: String, 
    required: true, 
    match: [/^\d{10}$/, 'Invalid phone number format (must be 10 digits)'] 
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  latitude: { type: Number }, // Add latitude field
  longitude: { type: Number }, // Add longitude field
},{ timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
//   };
  
// User Model
const User = mongoose.model('User', userSchema);

// Home Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, phone, username, password } = req.body;

  if (!name || !email || !phone || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('Request Body:', req.body); // Log the request body for debugging

    const newUser = new User({ name, email, phone, username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Log the error for debugging

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Update Location Route
{/* app.post('/update-location', authenticate, async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const userId = req.user.userId; // Get user ID from the token
    const user = await User.findByIdAndUpdate(
      userId,
      { latitude, longitude },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    res.status(200).json({ message: 'Location updated successfully', user });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Error updating location' });
  }
}); */}



// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
// console.log('JWT Token:', token);

// Protected Route Example
app.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route', user: req.user });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
