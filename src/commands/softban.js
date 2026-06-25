const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Soft-ban a member')
    .addUserOption(option => option.setName('user').setDescription('User to soft-ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: 'I cannot soft-ban that user.', ephemeral: true });

    await interaction.guild.members.ban(target.id, { deleteMessageSeconds: 86400, reason });
    await interaction.guild.members.unban(target.id).catch(() => {});
    await interaction.reply({ content: `Soft-banned ${target.user.tag} for: ${reason}`, ephemeral: false });
  }
};
