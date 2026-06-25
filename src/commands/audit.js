const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SecurityLog = require('../database/models/SecurityLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('audit')
    .setDescription('Show recent security audit logs'),
  async execute(interaction) {
    const logs = await SecurityLog.find({ guildId: interaction.guildId }).sort({ createdAt: -1 }).limit(10);
    const embed = new EmbedBuilder()
      .setColor('#f39c12')
      .setTitle('Recent Audit Logs')
      .setDescription(logs.length ? logs.map(log => `• ${log.type} — ${log.details || 'No details'}`).join('\n') : 'No security logs recorded yet.');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
