const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  image: {
    type: String,
    default: '' // Default empty string if no image
  },
  googleAccessToken: {
    type: String,
    select: false // Don't return in queries by default
  },
  googleRefreshToken: {
    type: String,
    select: false // Security: never expose this
  },
  googleTokenExpiry: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster email queries
userSchema.index({ email: 1 });

// Index for token expiry checks
userSchema.index({ googleTokenExpiry: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;