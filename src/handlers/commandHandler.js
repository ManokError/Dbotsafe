const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config');

function loadCommands(client) {
  const commandsDir = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file !== '.gitkeep');

  for (const file of commandFiles) {
    const command = require(path.join(commandsDir, file));
    if (command?.data?.name) {
      client.commands.set(command.data.name, command);
    }
  }
}

async function registerCommands(client) {
  if (!config.token) {
    throw new Error('DISCORD_TOKEN is required for slash command registration');
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  const clientId = client.application?.id || config.clientId;

  if (!clientId) {
    throw new Error('CLIENT_ID is required for slash command registration');
  }

  const slashCommands = [];

  for (const command of client.commands.values()) {
    try {
      const payload = command.data?.toJSON?.();
      if (payload?.name) {
        slashCommands.push(payload);
      }
    } catch (error) {
      console.error(`Failed to serialize slash command ${command.data?.name || 'unknown'}:`, error.message);
    }
  }

  if (!slashCommands.length) {
    console.warn('No slash commands were available for registration.');
    return;
  }

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body: slashCommands });
    console.log(`Registered ${slashCommands.length} slash command(s) to guild ${config.guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
    console.log(`Registered ${slashCommands.length} slash command(s) globally`);
  }
}

module.exports = { loadCommands, registerCommands };
