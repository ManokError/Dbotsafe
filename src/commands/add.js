const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a user to the current ticket')
    .addUserOption(option => option.setName('user').setDescription('User to add').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    await interaction.channel.permissionOverwrites.edit(target.id, { ViewChannel: true, SendMessages: true });
    await interaction.reply({ content: `Added ${target.tag} to the ticket.`, ephemeral: false });
  }
};
