const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Show current security configuration'),
  async execute(interaction) {
    const settings = await GuildSettings.findOne({ guildId: interaction.guildId }) || new GuildSettings({ guildId: interaction.guildId });
    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setTitle('Security Overview')
      .addFields(
        { name: 'Anti-Link', value: settings.security?.antiLink ? 'Enabled' : 'Disabled', inline: true },
        { name: 'Anti-Invite', value: settings.security?.antiInvite ? 'Enabled' : 'Disabled', inline: true },
        { name: 'Anti-Spam', value: settings.security?.antiSpam ? 'Enabled' : 'Disabled', inline: true },
        { name: 'Anti-Raid', value: settings.security?.antiRaid ? 'Enabled' : 'Disabled', inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
