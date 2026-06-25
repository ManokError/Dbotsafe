const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  moderation: {
    modLogChannelId: { type: String, default: null },
    welcomeChannelId: { type: String, default: null },
    muteRoleId: { type: String, default: null },
    loggingEnabled: { type: Boolean, default: true }
  },
  security: {
    antiLink: { type: Boolean, default: true },
    antiInvite: { type: Boolean, default: true },
    antiSpam: { type: Boolean, default: true },
    antiRaid: { type: Boolean, default: true },
    lockdownActive: { type: Boolean, default: false },
    emergencyMode: { type: Boolean, default: false },
    whitelist: [{ type: String }],
    spamLimit: { type: Number, default: 7 },
    spamInterval: { type: Number, default: 10 },
    raidThreshold: { type: Number, default: 8 },
    raidWindow: { type: Number, default: 60 }
  },
  autoRole: { type: String, default: null },
  welcome: {
    enabled: { type: Boolean, default: true },
    channelId: { type: String, default: null },
    message: { type: String, default: 'Welcome {user} to {server}!' },
    dmEnabled: { type: Boolean, default: false },
    dmMessage: { type: String, default: 'Welcome to {server}!' }
  },
  suggestions: {
    channelId: { type: String, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
