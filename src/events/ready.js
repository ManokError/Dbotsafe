const { registerCommands } = require('../handlers/commandHandler');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    try {
      client.user.setActivity({ name: 'ELIJAHSEC • Live Security', type: 3 });
      console.log(`Ready! Logged in as ${client.user.tag}`);
      console.log(`Loaded ${client.commands.size} slash commands.`);
    } catch (error) {
      console.error('Failed to initialize client readiness:', error.message);
    }
  }
};
