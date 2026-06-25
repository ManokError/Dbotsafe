const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription('Manage anti-link protection')
    .addSubcommand(subcommand => subcommand.setName('enable').setDescription('Enable anti-link'))
    .addSubcommand(subcommand => subcommand.setName('disable').setDescription('Disable anti-link'))
    .addSubcommandGroup(group => group.setName('whitelist').setDescription('Manage the link whitelist')
      .addSubcommand(sub => sub.setName('add').setDescription('Add a domain to the whitelist').addStringOption(option => option.setName('domain').setDescription('Domain to allow').setRequired(true)))
      .addSubcommand(sub => sub.setName('remove').setDescription('Remove a domain from the whitelist').addStringOption(option => option.setName('domain').setDescription('Domain to remove').setRequired(true))))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    const settings = await GuildSettings.findOne({ guildId: interaction.guildId });
    const record = settings || new GuildSettings({ guildId: interaction.guildId });

    if (subcommand === 'enable') {
      record.security.antiLink = true;
      await record.save();
      return interaction.reply({ content: 'Anti-link enabled.', ephemeral: true });
    }

    if (subcommand === 'disable') {
      record.security.antiLink = false;
      await record.save();
      return interaction.reply({ content: 'Anti-link disabled.', ephemeral: true });
    }

    if (group === 'whitelist') {
      const target = interaction.options.getString('domain');
      if (!target) return interaction.reply({ content: 'Domain is required.', ephemeral: true });

      if (subcommand === 'add') {
        if (!record.security.whitelist.includes(target)) record.security.whitelist.push(target);
        await record.save();
        return interaction.reply({ content: `Added ${target} to the whitelist.`, ephemeral: true });
      }

      record.security.whitelist = record.security.whitelist.filter(domain => domain !== target);
      await record.save();
      return interaction.reply({ content: `Removed ${target} from the whitelist.`, ephemeral: true });
    }

    const target = interaction.options.getString('domain');
    if (!target) return interaction.reply({ content: 'Domain is required.', ephemeral: true });

    if (subcommand === 'add') {
      if (!record.security.whitelist.includes(target)) record.security.whitelist.push(target);
      await record.save();
      return interaction.reply({ content: `Added ${target} to the whitelist.`, ephemeral: true });
    }

    record.security.whitelist = record.security.whitelist.filter(domain => domain !== target);
    await record.save();
    await interaction.reply({ content: `Removed ${target} from the whitelist.`, ephemeral: true });
  }
};
