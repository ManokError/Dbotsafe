const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Welcome = require('../database/models/Welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set the welcome channel')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to use for welcomes').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    await Welcome.findOneAndUpdate(
      { guildId: interaction.guildId },
      { guildId: interaction.guildId, channelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `Welcome channel set to ${channel}.`, ephemeral: true });
  }
};
