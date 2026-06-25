# ELIJAHSEC Discord Security Bot

ELIJAHSEC is a production-grade Discord moderation and security bot built with Node.js 22, Discord.js v14, and MongoDB Atlas. It supports slash commands only, modular handlers, automatic command registration, persistent components, and deployment on Railway.

## Features
- Core moderation: /ban, /kick, /timeout, /warn, /warnings, /clearwarnings, /softban, /modstats
- Logging and audit: /setlog, /logs enable, /logs disable
- Welcome system: /setwelcome, /welcome enable, /welcome disable, /welcomedm enable, /welcomedm disable
- Auto-role: /setautorole, /autorole enable, /autorole disable
- Verification: /verify setup, /verify enable, /verify disable
- Tickets: /ticket-panel, /close, /add, /remove, /claim, /rename, /transcript
- Security: /antilink, /antiinvite, /antispam, /antiraid, /emergency, /lockdown, /unlock
- Analytics and support: /stats, /security, /audit, /backup, /help, /suggest

## Project Structure
- src/index.js — entry point
- src/commands — slash commands
- src/events — Discord event handlers
- src/handlers — feature and command-loading logic
- src/database/models — MongoDB models
- src/utils — shared helpers

## Installation
1. Install Node.js 22+
2. Run npm install
3. Copy .env.example to .env and fill the values
4. Run npm start

## Railway Deployment
1. Create a new Railway project
2. Connect the repository
3. Set the environment variables from .env.example
4. Deploy

## Database
Create a MongoDB Atlas cluster and provide the connection string in MONGODB_URI.

## Notes
- The bot uses slash commands only.
- Command registration is automatic on startup.
- Security events, tickets, warnings, and welcome settings are persisted to MongoDB.
