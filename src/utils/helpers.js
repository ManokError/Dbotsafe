function safeReply(interaction, message) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp(message);
  }
  return interaction.reply(message);
}

module.exports = { safeReply };
