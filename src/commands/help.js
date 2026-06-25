const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits
} = require('discord.js');

const Warning = require('../database/models/Warning');
const Ticket = require('../database/models/Ticket');
const SecurityLog = require('../database/models/SecurityLog');
const GuildSettings = require('../database/models/GuildSettings');
const Welcome = require('../database/models/Welcome');
const AutoRole = require('../database/models/AutoRole');
const Verification = require('../database/models/Verification');

const menuOptions = [
  { label: 'Home', value: '0', description: 'Security overview' },
  { label: 'Moderation', value: '1', description: 'Moderation suite' },
  { label: 'Security', value: '2', description: 'Protection status' },
  { label: 'Tickets', value: '3', description: 'Support queue' },
  { label: 'Analytics', value: '4', description: 'Performance insights' },
  { label: 'Settings', value: '5', description: 'Server configuration' }
];

function createNavRow(pageIndex) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('help:page:0').setLabel('🏠 Home').setStyle(pageIndex === 0 ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:page:1').setLabel('👮 Moderation').setStyle(pageIndex === 1 ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:page:2').setLabel('🛡️ Security').setStyle(pageIndex === 2 ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:page:3').setLabel('🎫 Tickets').setStyle(pageIndex === 3 ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:page:4').setLabel('📊 Analytics').setStyle(pageIndex === 4 ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:page:5').setLabel('⚙️ Settings').setStyle(pageIndex === 5 ? ButtonStyle.Primary : ButtonStyle.Secondary)
  );

  const paginationRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('help:refresh').setLabel('🔄 Refresh').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:prev').setLabel('◀ Previous').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:next').setLabel('Next ▶').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('help:settings').setLabel('✏️ Edit Settings').setStyle(ButtonStyle.Success)
  );

  return [row, paginationRow];
}

function createSelectMenu(pageIndex) {
  const options = menuOptions.map(option => {
    const builder = new StringSelectMenuOptionBuilder()
      .setLabel(option.label)
      .setValue(option.value)
      .setDescription(option.description);

    if (option.value === String(pageIndex)) {
      builder.setDefault(true);
    }

    return builder;
  });

  const select = new StringSelectMenuBuilder()
    .setCustomId('help:select')
    .setPlaceholder('Jump to a section')
    .setOptions(options)
    .setMinValues(1)
    .setMaxValues(1);

  return new ActionRowBuilder().addComponents(select);
}

function getBadge(value, enabledLabel = 'Enabled', disabledLabel = 'Disabled') {
  return value ? `🟢 ${enabledLabel}` : `🔴 ${disabledLabel}`;
}

function buildPage({ interaction, pageIndex, stats, settings, verification, welcome, autoRole, client }) {
  const guild = interaction.guild;
  const separator = '━━━━━━━━━━━━━━━━━━━━━━';
  const title = '🛡️ ELIJAHSEC SECURITY CENTER';

  switch (pageIndex) {
    case 0: {
      const embed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle(title)
        .setDescription(`╔══════════════════════════════╗\n${title}\n╚══════════════════════════════╝\n\nAdvanced Security & Moderation Platform\nEnterprise-grade protection for modern communities.\n\n${separator}`)
        .addFields(
          { name: '👥 Total Members', value: `${guild.memberCount.toLocaleString()}`, inline: true },
          { name: '🎫 Open Tickets', value: `${stats.openTickets}`, inline: true },
          { name: '⚠️ Total Warnings', value: `${stats.totalWarnings}`, inline: true },
          { name: '🛡️ Security Status', value: stats.securityStatus, inline: true },
          { name: '📡 Database Status', value: client.dbConnected ? '🟢 Connected' : '🔴 Offline', inline: true },
          { name: '🚨 Anti-Raid Status', value: getBadge(settings.security?.antiRaid, 'Active', 'Disabled'), inline: true }
        )
        .setFooter({ text: 'ELIJAHSEC Enterprise Protection' });
      return embed;
    }
    case 1: {
      const embed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle('👮 Moderation Suite')
        .setDescription(`Professional moderation controls with audit trail support.\n\n${separator}`)
        .addFields(
          { name: '/ban', value: '🛑 Ban a member with a documented reason and audit trail.', inline: false },
          { name: '/kick', value: '🚪 Remove a member without a permanent ban.', inline: false },
          { name: '/timeout', value: '⏱️ Temporarily restrict messaging for a member.', inline: false },
          { name: '/warn', value: '⚠️ Issue a formal moderation warning.', inline: false },
          { name: '/warnings', value: '📋 View the full warning history for a user.', inline: false },
          { name: '/clearwarnings', value: '🧹 Clear warning records for a targeted user.', inline: false }
        )
        .setFooter({ text: 'Enterprise moderation tools' });
      return embed;
    }
    case 2: {
      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🛡️ Security Protection')
        .setDescription(`Live protection layers and enforcement status.\n\n${separator}`)
        .addFields(
          { name: 'Anti-Raid', value: getBadge(settings.security?.antiRaid, 'Active', 'Inactive'), inline: true },
          { name: 'Anti-Spam', value: getBadge(settings.security?.antiSpam, 'Active', 'Inactive'), inline: true },
          { name: 'Anti-Link', value: getBadge(settings.security?.antiLink, 'Active', 'Inactive'), inline: true },
          { name: 'Anti-Invite', value: getBadge(settings.security?.antiInvite, 'Active', 'Inactive'), inline: true },
          { name: 'Verification', value: verification?.enabled ? '🟢 Enabled' : '🔴 Disabled', inline: true },
          { name: 'Auto-Role', value: autoRole?.enabled ? '🟢 Enabled' : '🔴 Disabled', inline: true }
        )
        .setFooter({ text: 'Protection layer overview' });
      return embed;
    }
    case 3: {
      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle('🎫 Support & Ticket System')
        .setDescription(`Streamlined ticket operations for support and escalation.\n\n${separator}`)
        .addFields(
          { name: 'Open Tickets', value: `${stats.openTickets}`, inline: true },
          { name: 'Claimed Tickets', value: `${stats.claimedTickets}`, inline: true },
          { name: 'Pending Tickets', value: `${stats.pendingTickets}`, inline: true },
          { name: 'Commands', value: '/ticket-panel • /close • /add • /remove • /claim • /rename • /transcript', inline: false }
        )
        .setFooter({ text: 'Ticket operations center' });
      return embed;
    }
    case 4: {
      const embed = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle('📊 Analytics Dashboard')
        .setDescription(`Operational insights and moderation activity.\n\n${separator}`)
        .addFields(
          { name: 'Total Members', value: `${guild.memberCount.toLocaleString()}`, inline: true },
          { name: 'New Members Today', value: `${stats.newMembersToday}`, inline: true },
          { name: 'Warnings Issued', value: `${stats.totalWarnings}`, inline: true },
          { name: 'Tickets Created', value: `${stats.totalTickets}`, inline: true },
          { name: 'Messages Monitored', value: `${stats.messagesMonitored}`, inline: true }
        )
        .setFooter({ text: 'Live analytics for the server' });
      return embed;
    }
    case 5: {
      const embed = new EmbedBuilder()
        .setColor('#34495e')
        .setTitle('⚙️ Server Settings')
        .setDescription(`Configuration overview for logging, welcome flow, roles, and tickets.\n\n${separator}`)
        .addFields(
          { name: 'Log Channel', value: settings.logChannel || 'Not configured', inline: false },
          { name: 'Welcome Channel', value: welcome?.channelId ? `<#${welcome.channelId}>` : 'Not configured', inline: false },
          { name: 'Staff Role', value: settings.staffRole || 'Not configured', inline: false },
          { name: 'Verified Role', value: verification?.roleId ? `<@&${verification.roleId}>` : 'Not configured', inline: false },
          { name: 'Ticket Category', value: settings.ticketCategory || 'Not configured', inline: false }
        )
        .setFooter({ text: 'Configuration & routing center' });
      return embed;
    }
    default:
      return new EmbedBuilder().setColor('#00d4ff').setTitle(title).setDescription('Premium dashboard unavailable.');
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Open the premium ELIJAHSEC security dashboard'),
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      if (!guild) {
        return interaction.reply({ content: 'This dashboard is only available in a server.', ephemeral: true });
      }

      const [settingsDoc, warnings, tickets, securityLogs, welcomeDoc, autoRoleDoc, verificationDoc] = await Promise.all([
        GuildSettings.findOne({ guildId: guild.id }),
        Warning.countDocuments({ guildId: guild.id }),
        Ticket.find({ guildId: guild.id }),
        SecurityLog.countDocuments({ guildId: guild.id }),
        Welcome.findOne({ guildId: guild.id }),
        AutoRole.findOne({ guildId: guild.id }),
        Verification.findOne({ guildId: guild.id })
      ]);

      const settings = {
        security: settingsDoc?.security || {},
        logChannel: settingsDoc?.moderation?.modLogChannelId ? `<#${settingsDoc.moderation.modLogChannelId}>` : 'Not configured',
        staffRole: settingsDoc?.staffRoleId ? `<@&${settingsDoc.staffRoleId}>` : 'Not configured',
        ticketCategory: settingsDoc?.ticketCategoryId ? `<#${settingsDoc.ticketCategoryId}>` : 'Not configured'
      };

      const stats = {
        openTickets: tickets.filter(ticket => ticket.status === 'open').length,
        claimedTickets: tickets.filter(ticket => ticket.status === 'claimed' || ticket.assignedTo).length,
        pendingTickets: tickets.filter(ticket => ticket.status === 'pending').length,
        totalWarnings: warnings,
        totalTickets: tickets.length,
        messagesMonitored: securityLogs,
        newMembersToday: guild.members.cache.filter(member => Date.now() - member.user.createdTimestamp < 86_400_000).size,
        securityStatus: settings.security?.antiRaid || settings.security?.antiSpam ? '🟢 Protected' : '🟡 Warning'
      };

      let pageIndex = 0;
      const createComponents = (currentPage) => {
        const rows = createNavRow(currentPage);
        rows.unshift(createSelectMenu(currentPage));
        return rows;
      };

      const message = await interaction.reply({
        embeds: [buildPage({ interaction, pageIndex, stats, settings, verification: verificationDoc, welcome: welcomeDoc, autoRole: autoRoleDoc, client: interaction.client })],
        components: createComponents(pageIndex),
        fetchReply: true
      });

      const collector = message.createMessageComponentCollector({
        filter: (componentInteraction) => componentInteraction.user.id === interaction.user.id,
        time: 180_000
      });

      collector.on('collect', async (componentInteraction) => {
        try {
          if (componentInteraction.isButton()) {
            if (componentInteraction.customId === 'help:refresh') {
              // keep the current page and refresh the content
            } else if (componentInteraction.customId === 'help:settings') {
              if (!componentInteraction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
                return componentInteraction.reply({ content: 'You need Manage Server permission to edit settings.', ephemeral: true });
              }

              const modal = new ModalBuilder()
                .setCustomId('help:settings:modal')
                .setTitle('Edit Server Settings');

              const logChannelInput = new TextInputBuilder()
                .setCustomId('logChannel')
                .setLabel('Log Channel ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder('Paste channel ID');

              const welcomeChannelInput = new TextInputBuilder()
                .setCustomId('welcomeChannel')
                .setLabel('Welcome Channel ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder('Paste channel ID');

              modal.addComponents(
                new ActionRowBuilder().addComponents(logChannelInput),
                new ActionRowBuilder().addComponents(welcomeChannelInput)
              );

              return componentInteraction.showModal(modal);
            } else if (componentInteraction.customId === 'help:prev') {
              pageIndex = (pageIndex - 1 + 6) % 6;
            } else if (componentInteraction.customId === 'help:next') {
              pageIndex = (pageIndex + 1) % 6;
            } else if (componentInteraction.customId.startsWith('help:page:')) {
              pageIndex = Number(componentInteraction.customId.split(':').pop());
            }
          } else if (componentInteraction.isStringSelectMenu()) {
            pageIndex = Number(componentInteraction.values[0]);
          }

          await componentInteraction.update({
            embeds: [buildPage({ interaction, pageIndex, stats, settings, verification: verificationDoc, welcome: welcomeDoc, autoRole: autoRoleDoc, client: interaction.client })],
            components: createComponents(pageIndex)
          });
        } catch (error) {
          console.error('Help dashboard interaction error:', error);
          if (!componentInteraction.replied) {
            await componentInteraction.reply({ content: 'The dashboard could not be updated right now.', ephemeral: true });
          }
        }
      });

      collector.on('end', async () => {
        try {
          const disabledComponents = message.components.map((row) => {
            const newRow = ActionRowBuilder.from(row);
            newRow.components = newRow.components.map((component) => {
              if (component.type === 2) {
                return ButtonBuilder.from(component).setDisabled(true);
              }
              if (component.type === 3) {
                return StringSelectMenuBuilder.from(component).setDisabled(true);
              }
              return component;
            });
            return newRow;
          });

          await message.edit({ components: disabledComponents });
        } catch (error) {
          console.error('Help dashboard cleanup error:', error);
        }
      });
    } catch (error) {
      console.error('Help dashboard error:', error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'The premium dashboard could not be loaded.', ephemeral: true });
      }
    }
  }
};
