const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban) {
    const settings = await GuildSettings.findOne({ guildId: ban.guild.id });
    if (!settings?.moderation?.modLogChannelId) return;
    const channel = ban.guild.channels.cache.get(settings.moderation.modLogChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder().setColor('#ffcc00').setTitle('Member Banned').setDescription(`${ban.user.tag} was banned.`);
    await channel.send({ embeds: [embed] });
  }
};
