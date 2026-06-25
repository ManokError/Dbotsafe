const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || message.author?.bot) return;
    const settings = await GuildSettings.findOne({ guildId: message.guild.id });
    if (!settings?.moderation?.modLogChannelId) return;
    const channel = message.guild.channels.cache.get(settings.moderation.modLogChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder().setColor('#f39c12').setTitle('Message Deleted').setDescription(`Message by ${message.author.tag}:\n${message.content || '[No content]'}`);
    await channel.send({ embeds: [embed] });
  }
};
