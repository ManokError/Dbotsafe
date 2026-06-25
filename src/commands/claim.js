const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Assign yourself to the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ticket = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
    if (!ticket) return interaction.reply({ content: 'This channel is not a ticket.', ephemeral: true });

    ticket.assignedTo = interaction.user.id;
    await ticket.save();
    await interaction.reply({ content: `You are now assigned to this ticket.`, ephemeral: false });
  }
};
