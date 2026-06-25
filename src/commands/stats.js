const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warning = require('../database/models/Warning');
const Ticket = require('../database/models/Ticket');
const SecurityLog = require('../database/models/SecurityLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show server statistics'),
  async execute(interaction) {
    const [warnings, openTickets, securityEvents] = await Promise.all([
      Warning.countDocuments({ guildId: interaction.guildId }),
      Ticket.countDocuments({ guildId: interaction.guildId, status: 'open' }),
      SecurityLog.countDocuments({ guildId: interaction.guildId })
    ]);

    const embed = new EmbedBuilder()
      .setColor('#00d4ff')
      .setTitle('Server Statistics')
      .addFields(
        { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
        { name: 'Open Tickets', value: `${openTickets}`, inline: true },
        { name: 'Warnings', value: `${warnings}`, inline: true },
        { name: 'Security Events', value: `${securityEvents}`, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
