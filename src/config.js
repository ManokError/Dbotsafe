function isPlaceholder(value) {
  return typeof value === 'string' && value.trim() !== '' && /your_|example|placeholder|changeme/i.test(value);
}

function validateConfig(overrides = {}) {
  const config = {
    token: overrides.token ?? process.env.DISCORD_TOKEN ?? process.env.TOKEN,
    clientId: overrides.clientId ?? process.env.CLIENT_ID,
    guildId: overrides.guildId ?? process.env.GUILD_ID,
    mongoUri: overrides.mongoUri ?? process.env.MONGODB_URI,
    ownerId: overrides.ownerId ?? process.env.OWNER_ID,
    defaultPrefix: overrides.defaultPrefix ?? (process.env.DEFAULT_PREFIX || '/'),
    welcomeChannelId: overrides.welcomeChannelId ?? process.env.WELCOME_CHANNEL_ID,
    modLogChannelId: overrides.modLogChannelId ?? process.env.MOD_LOG_CHANNEL_ID ?? process.env.LOG_CHANNEL_ID,
    logChannelId: overrides.logChannelId ?? process.env.LOG_CHANNEL_ID,
    ticketCategoryId: overrides.ticketCategoryId ?? process.env.TICKET_CATEGORY_ID,
    transcriptChannelId: overrides.transcriptChannelId ?? process.env.TRANSCRIPT_CHANNEL_ID,
    suggestionChannelId: overrides.suggestionChannelId ?? process.env.SUGGESTION_CHANNEL_ID,
    autoRoleId: overrides.autoRoleId ?? process.env.AUTO_ROLE_ID,
    staffRoleId: overrides.staffRoleId ?? process.env.STAFF_ROLE_ID,
    verifiedRoleId: overrides.verifiedRoleId ?? process.env.VERIFIED_ROLE_ID,
    antiLinkWhitelist: (overrides.antiLinkWhitelist ?? (process.env.ANTI_LINK_WHITELIST || '')).split(',').map(v => v.trim()).filter(Boolean)
  };

  const errors = [];

  if (!config.token || isPlaceholder(config.token)) {
    errors.push('DISCORD_TOKEN is required and must be set to a real bot token.');
  }

  if (!config.clientId || isPlaceholder(config.clientId)) {
    errors.push('CLIENT_ID is required and must be set to a real application ID.');
  }

  return { config, errors };
}

const { config, errors } = validateConfig();

if (errors.length) {
  console.error('Configuration errors:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
}

module.exports = {
  ...config,
  validateConfig
};
