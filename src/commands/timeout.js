const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option => option.setName('user').setDescription('User to timeout').setRequired(true))
    .addIntegerOption(option => option.setName('minutes').setDescription('Timeout duration in minutes').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    const duration = minutes * 60 * 1000;
    await target.timeout(duration, reason);
    await interaction.reply({ content: `Timed out ${target.user.tag} for ${minutes} minute(s).`, ephemeral: false });
  }
};
