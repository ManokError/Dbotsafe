const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
