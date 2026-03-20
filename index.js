const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT);

function createBot() {
  const bot = mineflayer.createBot({
    host: "Novasmpmc.aternos.me",
    port: 21729,
    username: "AFK_BOT",
    version: false
  });

  bot.once('spawn', () => {
    console.log("Bot joined");

    // move once (fix griefprevention)
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    // anti afk
    setInterval(() => {
      const actions = ['forward', 'back', 'left', 'right'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      bot.setControlState(action, true);
      setTimeout(() => bot.setControlState(action, false), 1000);

      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);

    }, 5000);
  });

  bot.on('end', () => {
    console.log("Reconnecting...");
    setTimeout(createBot, 15000);
  });

  bot.on('error', err => console.log(err));
}

createBot();
