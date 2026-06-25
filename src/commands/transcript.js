const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Generate a transcript for the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ticket = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
    if (!ticket) return interaction.reply({ content: 'This channel is not a ticket.', ephemeral: true });

    ticket.transcript = `Transcript generated for ${interaction.channel.name}`;
    await ticket.save();
    await interaction.reply({ content: 'Transcript saved for this ticket.', ephemeral: true });
  }
};
