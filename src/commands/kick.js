const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option => option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: 'I cannot kick that user.', ephemeral: true });

    await target.kick(reason);
    await interaction.reply({ content: `Kicked ${target.user.tag} for: ${reason}`, ephemeral: false });
  }
};
