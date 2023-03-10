const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  avatar: String,
  description: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' }],
  canFavorite: Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
