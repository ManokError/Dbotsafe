const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  creatorId: { type: String, required: true },
  assignedTo: { type: String, default: null },
  status: { type: String, default: 'open' },
  topic: { type: String, default: 'Support' },
  transcript: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Ticket', ticketSchema);
