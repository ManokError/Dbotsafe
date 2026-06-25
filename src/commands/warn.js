const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    await Warning.create({ guildId: interaction.guildId, userId: target.id, moderatorId: interaction.user.id, reason });
    await interaction.reply({ content: `Warned ${target.tag} for: ${reason}`, ephemeral: false });
  }
};
