require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { connectDB } = require('./database/connection');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { validateConfig } = require('./config');

const { config, errors } = validateConfig();

if (errors.length) {
  console.error('Configuration errors:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection:', error);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildWebhooks
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

client.commands = new Collection();
client.cooldowns = new Map();
client.securityState = {
  raidMode: false,
  lockdownActive: false,
  joinFlood: new Map(),
  mentionSpam: new Map(),
  recentBans: []
};

(async () => {
  try {
    const dbConnected = await connectDB();
    client.dbConnected = dbConnected;
    loadCommands(client);
    loadEvents(client);

    client.on('error', error => console.error('Discord client error:', error));
    client.on('warn', warning => console.warn('Discord warning:', warning));

    await client.login(config.token);
    await client.application.fetch();
    await registerCommands(client);
    client.user.setActivity({ name: 'ELIJAHSEC • Live Security', type: ActivityType.Watching });
    console.log(`ELIJAHSEC connected as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to start ELIJAHSEC:', error);
    process.exit(1);
  }
})();
