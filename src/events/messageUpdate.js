const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author?.bot) return;
    const settings = await GuildSettings.findOne({ guildId: newMessage.guild.id });
    if (!settings?.moderation?.modLogChannelId) return;
    const channel = newMessage.guild.channels.cache.get(settings.moderation.modLogChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder().setColor('#3498db').setTitle('Message Edited').setDescription(`Message by ${newMessage.author.tag} was edited.\nBefore: ${oldMessage.content}\nAfter: ${newMessage.content}`);
    await channel.send({ embeds: [embed] });
  }
};
