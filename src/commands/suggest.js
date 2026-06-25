const { SlashCommandBuilder } = require('discord.js');
const Suggestion = require('../database/models/Suggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption(option => option.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
    const channel = interaction.guild.channels.cache.get(process.env.SUGGESTION_CHANNEL_ID) || interaction.channel;
    const message = await channel.send({ content: suggestion });
    await Suggestion.create({ guildId: interaction.guildId, messageId: message.id, authorId: interaction.user.id, content: suggestion });
    await interaction.reply({ content: 'Suggestion submitted.', ephemeral: true });
  }
};
