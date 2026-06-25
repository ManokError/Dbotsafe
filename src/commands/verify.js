const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Verification = require('../database/models/Verification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Configure verification for your server')
    .addSubcommand(subcommand => subcommand.setName('setup').setDescription('Set up verification').addRoleOption(option => option.setName('role').setDescription('Verified role').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable verification'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable verification'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      const role = interaction.options.getRole('role');
      await Verification.findOneAndUpdate(
        { guildId: interaction.guildId },
        { guildId: interaction.guildId, enabled: true, roleId: role.id },
        { upsert: true, new: true }
      );

      const embed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle('Verification Setup')
        .setDescription('Verification is now ready. Members can verify using the button below.');

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('verify:confirm').setLabel('Verify Me').setStyle(ButtonStyle.Success)
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
      return;
    }

    const verification = await Verification.findOne({ guildId: interaction.guildId });
    if (!verification) {
      await interaction.reply({ content: 'Verification is not set up yet.', ephemeral: true });
      return;
    }

    if (subcommand === 'enable') {
      verification.enabled = true;
      await verification.save();
      await interaction.reply({ content: 'Verification enabled.', ephemeral: true });
      return;
    }

    verification.enabled = false;
    await verification.save();
    await interaction.reply({ content: 'Verification disabled.', ephemeral: true });
  }
};
