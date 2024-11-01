const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Password is required for regular users but not for Google users
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
    },
  });
  
  module.exports = mongoose.model('User', userSchema);
  