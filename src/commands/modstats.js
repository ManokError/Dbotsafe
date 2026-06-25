const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warning = require('../database/models/Warning');
const SecurityLog = require('../database/models/SecurityLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modstats')
    .setDescription('Show moderation and security statistics for this server'),
  async execute(interaction) {
    const warnings = await Warning.countDocuments({ guildId: interaction.guildId });
    const securityLogs = await SecurityLog.countDocuments({ guildId: interaction.guildId });

    const embed = new EmbedBuilder()
      .setColor('#00d4ff')
      .setTitle('Moderation Statistics')
      .setDescription('Live server moderation overview')
      .addFields(
        { name: 'Warnings', value: `${warnings}`, inline: true },
        { name: 'Security Events', value: `${securityLogs}`, inline: true },
        { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
