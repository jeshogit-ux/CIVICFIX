const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 30
  },
  xp: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Supporter'
  },
  avatar: {
    type: String,
    default: 'U'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
