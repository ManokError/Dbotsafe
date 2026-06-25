const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const settings = await GuildSettings.findOne({ guildId: member.guild.id });
    if (!settings?.moderation?.modLogChannelId) return;
    const channel = member.guild.channels.cache.get(settings.moderation.modLogChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('Member Left')
      .setDescription(`${member.user.tag} left the server.`);
    await channel.send({ embeds: [embed] });
  }
};
