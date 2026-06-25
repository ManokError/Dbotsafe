const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a user from the current ticket')
    .addUserOption(option => option.setName('user').setDescription('User to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    await interaction.channel.permissionOverwrites.edit(target.id, { ViewChannel: false, SendMessages: false });
    await interaction.reply({ content: `Removed ${target.tag} from the ticket.`, ephemeral: false });
  }
};
