const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');
const AutoRole = require('../database/models/AutoRole');
const Welcome = require('../database/models/Welcome');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const settings = await GuildSettings.findOne({ guildId: member.guild.id });
    const welcome = await Welcome.findOne({ guildId: member.guild.id });
    const autoRole = await AutoRole.findOne({ guildId: member.guild.id });

    if (autoRole?.enabled && autoRole?.roleId) {
      const role = member.guild.roles.cache.get(autoRole.roleId);
      if (role) await member.roles.add(role).catch(() => {});
    }

    if (welcome?.enabled && welcome?.channelId) {
      const channel = member.guild.channels.cache.get(welcome.channelId);
      const embed = new EmbedBuilder()
        .setColor('#00ff88')
        .setTitle('Welcome!')
        .setDescription(welcome.message.replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name))
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Member Count', value: `${member.guild.memberCount}` },
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` }
        )
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) });
      if (channel) await channel.send({ embeds: [embed] });
    }
  }
};
