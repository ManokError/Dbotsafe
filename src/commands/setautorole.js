const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../database/models/AutoRole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set the auto-role for new members')
    .addRoleOption(option => option.setName('role').setDescription('Role to assign to new members').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    await AutoRole.findOneAndUpdate(
      { guildId: interaction.guildId },
      { guildId: interaction.guildId, roleId: role.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Auto-role set to ${role}.`, ephemeral: true });
  }
};
