const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Manage anti-raid protection')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable anti-raid'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable anti-raid'))
    .addSubcommand(subcommand => subcommand
      .setName('threshold')
      .setDescription('Set the raid threshold')
      .addIntegerOption(option => option.setName('amount').setDescription('Join threshold').setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('window')
      .setDescription('Set the raid window')
      .addIntegerOption(option => option.setName('seconds').setDescription('Window size in seconds').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const record = await GuildSettings.findOne({ guildId: interaction.guildId }) || new GuildSettings({ guildId: interaction.guildId });

    if (subcommand === 'enable') {
      record.security.antiRaid = true;
      await record.save();
      return interaction.reply({ content: 'Anti-raid enabled.', ephemeral: true });
    }

    if (subcommand === 'disable') {
      record.security.antiRaid = false;
      await record.save();
      return interaction.reply({ content: 'Anti-raid disabled.', ephemeral: true });
    }

    if (subcommand === 'threshold') {
      record.security.raidThreshold = interaction.options.getInteger('amount');
      await record.save();
      return interaction.reply({ content: `Anti-raid threshold set to ${interaction.options.getInteger('amount')}.`, ephemeral: true });
    }

    record.security.raidWindow = interaction.options.getInteger('seconds');
    await record.save();
    await interaction.reply({ content: `Anti-raid window set to ${interaction.options.getInteger('seconds')} seconds.`, ephemeral: true });
  }
};
