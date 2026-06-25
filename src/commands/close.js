const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ticket = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
    if (!ticket) return interaction.reply({ content: 'This channel is not a ticket.', ephemeral: true });

    await interaction.reply({ content: 'Closing ticket...', ephemeral: true });
    await interaction.channel.delete();
    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();
  }
};
