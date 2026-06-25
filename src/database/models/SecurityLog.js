const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: String, default: null },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecurityLog', securityLogSchema);
