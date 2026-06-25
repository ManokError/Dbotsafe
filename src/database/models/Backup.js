const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Backup', backupSchema);
