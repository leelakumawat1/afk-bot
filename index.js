const mineflayer = require('mineflayer');
const express = require('express');
const dns = require('dns');

// 🔥 FORCE DNS (important for Render)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log("🌐 Web server running"));

function createBot() {

  console.log("🚀 Starting bot...");

  const bot = mineflayer.createBot({
    host: "Novasmpmc.aternos.me", // ✅ only domain
    username: "AFK_BOT",
    version: false,
    auth: "offline",
    connectTimeout: 30000 // 🔥 increase timeout
  });

  // =========================
  // LOGIN EVENT
  // =========================
  bot.on('login', () => {
    console.log("✅ Logged in");
  });

  // =========================
  // SPAWN
  // =========================
  bot.once('spawn', () => {
    console.log("🤖 Bot joined server");

    const password = "123456";

    // 🔐 AUTHME FIX
    setTimeout(() => {
      bot.chat(`/register ${password} ${password}`);
    }, 4000);

    setTimeout(() => {
      bot.chat(`/login ${password}`);
    }, 7000);

    // 🚶 FIRST MOVE (important)
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    // 🤖 ANTI AFK LOOP
    setInterval(() => {
      try {

        // 👀 LOOK
        const yaw = Math.random() * Math.PI * 2;
        const pitch = Math.random() * 1.2 - 0.6;
        bot.look(yaw, pitch, true);

        // 🚶 MOVE
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        setTimeout(() => {
          bot.setControlState(action, false);
        }, 1000);

        // 🦘 JUMP
        if (Math.random() < 0.3) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
        }

      } catch (err) {
        console.log("Loop error:", err.message);
      }

    }, 8000); // 🔥 slower = more stable

  });

  // =========================
  // RECONNECT SYSTEM
  // =========================
  bot.on('end', () => {
    console.log("❌ Disconnected → retry in 30s");
    setTimeout(createBot, 30000); // 🔥 important delay
  });

  // =========================
  // ERRORS
  // =========================
  bot.on('kicked', (reason) => {
    console.log("⚠️ Kicked:", reason);
  });

  bot.on('error', (err) => {
    console.log("❌ Error:", err.code || err.message);
  });

}

// START
createBot();
