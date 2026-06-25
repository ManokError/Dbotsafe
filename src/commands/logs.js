const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Enable or disable logging')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable logging'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable logging'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const settings = await GuildSettings.findOneAndUpdate(
      { guildId: interaction.guildId },
      { $set: { 'moderation.loggingEnabled': subcommand === 'enable' } },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Logging ${subcommand === 'enable' ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
