const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emergency')
    .setDescription('Enable or disable emergency mode')
    .addSubcommand(subcommand => subcommand.setName('off').setDescription('Disable emergency mode'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const record = await GuildSettings.findOne({ guildId: interaction.guildId }) || new GuildSettings({ guildId: interaction.guildId });
    record.security.emergencyMode = interaction.options.getSubcommand() !== 'off';
    await record.save();

    await interaction.reply({ content: `Emergency mode ${record.security.emergencyMode ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
