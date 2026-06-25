const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../database/models/Welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomedm')
    .setDescription('Enable or disable welcome DMs')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable welcome DMs'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable welcome DMs'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const welcome = await Welcome.findOneAndUpdate(
      { guildId: interaction.guildId },
      { guildId: interaction.guildId, dmEnabled: subcommand === 'enable' },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Welcome DMs ${subcommand === 'enable' ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
