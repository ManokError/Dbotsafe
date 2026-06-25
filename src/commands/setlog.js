const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Set the logging channel for moderation and security events')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to use for logs').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const settings = await GuildSettings.findOneAndUpdate(
      { guildId: interaction.guildId },
      { $set: { 'moderation.modLogChannelId': channel.id } },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Logging channel set to ${channel}.`, ephemeral: true });
  }
};
