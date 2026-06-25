const { EmbedBuilder } = require('discord.js');
const Verification = require('../database/models/Verification');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'help:settings:modal') {
        const logChannel = interaction.fields.getTextInputValue('logChannel');
        const welcomeChannel = interaction.fields.getTextInputValue('welcomeChannel');

        await GuildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { $set: { 'moderation.modLogChannelId': logChannel || null, 'welcome.channelId': welcomeChannel || null } },
          { upsert: true, new: true }
        );

        return interaction.reply({ content: 'Settings updated successfully.', ephemeral: true });
      }
    }

    if (interaction.isButton() || interaction.isStringSelectMenu()) {
      if (interaction.message?.interaction?.commandName === 'help') {
        return;
      }

      if (interaction.customId === 'ticket:create') {
        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: 0,
          parent: process.env.TICKET_CATEGORY_ID || null,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
          ]
        });

        const embed = new EmbedBuilder()
          .setColor('#00d4ff')
          .setTitle('Ticket Opened')
          .setDescription(`Your support ticket is ready: ${channel}`);

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (interaction.customId === 'verify:confirm') {
        const verification = await Verification.findOne({ guildId: interaction.guild.id });
        if (!verification?.enabled) return interaction.reply({ content: 'Verification is currently disabled.', ephemeral: true });
        const role = interaction.guild.roles.cache.get(verification.roleId);
        if (role) await interaction.member.roles.add(role).catch(() => {});
        await interaction.reply({ content: 'Verification complete. You now have access.', ephemeral: true });
      }

      if (interaction.customId.startsWith('help:')) {
        const pages = {
          'help:moderation': 'Moderation tools include /ban, /kick, /timeout, /warn, /warnings, and /clearwarnings.',
          'help:security': 'Security tools include anti-link, anti-invite, anti-spam, anti-raid, lockdown, and logging.',
          'help:tickets': 'Tickets can be opened with the panel, managed with /add, /remove, /claim, /rename, and /close.',
          'help:stats': 'Statistics are available through the live dashboard and the logging system.'
        };

        const embed = new EmbedBuilder()
          .setColor('#00d4ff')
          .setTitle('ELIJAHSEC Feature')
          .setDescription(pages[interaction.customId]);

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while running this command.', ephemeral: true });
    }
  }
};
