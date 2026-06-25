const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Create a ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket:create').setLabel('Open Ticket').setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ content: 'Click the button below to open a support ticket.', components: [row] });
    await interaction.reply({ content: 'Ticket panel created.', ephemeral: true });
  }
};
