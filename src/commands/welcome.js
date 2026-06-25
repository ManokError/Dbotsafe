const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../database/models/Welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Enable or disable welcome messages')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable welcome messages'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable welcome messages'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const welcome = await Welcome.findOneAndUpdate(
      { guildId: interaction.guildId },
      { guildId: interaction.guildId, enabled: subcommand === 'enable' },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Welcome messages ${subcommand === 'enable' ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
