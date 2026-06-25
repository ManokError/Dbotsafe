const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiinvite')
    .setDescription('Manage anti-invite protection')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable anti-invite'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable anti-invite'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const record = await GuildSettings.findOne({ guildId: interaction.guildId }) || new GuildSettings({ guildId: interaction.guildId });

    record.security.antiInvite = subcommand === 'enable';
    await record.save();

    await interaction.reply({ content: `Anti-invite ${subcommand === 'enable' ? 'enabled' : 'disabled'}.`, ephemeral: true });
  }
};
