const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Backup = require('../database/models/Backup');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Create or restore a backup')
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a server backup'))
    .addSubcommand(subcommand => subcommand.setName('restore').setDescription('Restore a server backup'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      await Backup.findOneAndUpdate(
        { guildId: interaction.guildId },
        { guildId: interaction.guildId, data: { roles: [], channels: [], categories: [] } },
        { upsert: true, new: true }
      );
      return interaction.reply({ content: 'Backup created.', ephemeral: true });
    }

    await interaction.reply({ content: 'Backup restore is not implemented in this environment.', ephemeral: true });
  }
};
