const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename the current ticket channel')
    .addStringOption(option => option.setName('name').setDescription('New channel name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const topic = interaction.options.getString('name');
    await interaction.channel.setName(topic.replace(/\s+/g, '-').toLowerCase());
    await interaction.reply({ content: `Renamed the ticket to ${topic}.`, ephemeral: false });
  }
};
