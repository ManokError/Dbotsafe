const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear warnings for a user')
    .addUserOption(option => option.setName('user').setDescription('User to clear warnings for').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    await Warning.deleteMany({ guildId: interaction.guildId, userId: target.id });
    await interaction.reply({ content: `Cleared warnings for ${target.tag}.`, ephemeral: false });
  }
};
