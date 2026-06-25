const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  channelId: { type: String, default: null },
  message: { type: String, default: 'Welcome {user} to {server}!' },
  dmEnabled: { type: Boolean, default: false },
  dmMessage: { type: String, default: 'Welcome to {server}!' }
});

module.exports = mongoose.model('Welcome', welcomeSchema);
