const GuildSettings = require('../database/models/GuildSettings');
const SecurityLog = require('../database/models/SecurityLog');

const messageHistory = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const settings = await GuildSettings.findOne({ guildId: message.guild.id });
    if (!settings?.security) return;

    const content = message.content.toLowerCase();
    if (settings.security.antiLink && /https?:\/\//.test(content)) {
      const allowed = (process.env.ANTI_LINK_WHITELIST || '')
        .split(',')
        .map(v => v.trim())
        .some(domain => content.includes(domain));
      if (!allowed) {
        await message.delete();
        await SecurityLog.create({ guildId: message.guild.id, type: 'anti-link', userId: message.author.id, details: message.content });
      }
    }

    if (settings.security.antiInvite && /(discord\.gg|discord\.com\/invite)/.test(content)) {
      await message.delete();
      await SecurityLog.create({ guildId: message.guild.id, type: 'anti-invite', userId: message.author.id, details: message.content });
    }

    const userKey = `${message.guild.id}:${message.author.id}`;
    const bucket = messageHistory.get(userKey) || [];
    bucket.push(Date.now());
    const recent = bucket.filter(time => Date.now() - time < 10000);
    messageHistory.set(userKey, recent);
    if (recent.length > 7) {
      await message.delete();
      await SecurityLog.create({ guildId: message.guild.id, type: 'anti-spam', userId: message.author.id, details: 'Spam detected' });
    }
  }
};
