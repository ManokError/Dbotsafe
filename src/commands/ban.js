const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: 'I cannot ban that user.', ephemeral: true });

    await target.ban({ reason });
    await Warning.create({ guildId: interaction.guildId, userId: target.id, moderatorId: interaction.user.id, reason });

    await interaction.reply({ content: `Banned ${target.user.tag} for: ${reason}`, ephemeral: false });
  }
};
