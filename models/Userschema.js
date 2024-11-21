const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  position: {  
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;

