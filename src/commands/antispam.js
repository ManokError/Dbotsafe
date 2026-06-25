const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antispam')
    .setDescription('Manage anti-spam protection')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable anti-spam'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable anti-spam'))
    .addSubcommand(subcommand => subcommand
      .setName('limit')
      .setDescription('Set the spam limit')
      .addIntegerOption(option => option.setName('amount').setDescription('Max messages').setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('interval')
      .setDescription('Set the spam interval')
      .addIntegerOption(option => option.setName('seconds').setDescription('Window in seconds').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const record = await GuildSettings.findOne({ guildId: interaction.guildId }) || new GuildSettings({ guildId: interaction.guildId });

    if (subcommand === 'enable') {
      record.security.antiSpam = true;
      await record.save();
      return interaction.reply({ content: 'Anti-spam enabled.', ephemeral: true });
    }

    if (subcommand === 'disable') {
      record.security.antiSpam = false;
      await record.save();
      return interaction.reply({ content: 'Anti-spam disabled.', ephemeral: true });
    }

    if (subcommand === 'limit') {
      record.security.spamLimit = interaction.options.getInteger('amount');
      await record.save();
      return interaction.reply({ content: `Spam limit set to ${interaction.options.getInteger('amount')}.`, ephemeral: true });
    }

    record.security.spamInterval = interaction.options.getInteger('seconds');
    await record.save();
    await interaction.reply({ content: `Spam interval set to ${interaction.options.getInteger('seconds')} seconds.`, ephemeral: true });
  }
};
