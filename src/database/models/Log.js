const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
