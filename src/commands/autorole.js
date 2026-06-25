const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../database/models/AutoRole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Enable or disable auto-role assignment')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable auto-role'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable auto-role'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const autoRole = await AutoRole.findOneAndUpdate(
      { guildId: interaction.guildId },
      { guildId: interaction.guildId, enabled: subcommand === 'enable' },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Auto-role ${subcommand === 'enable' ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
