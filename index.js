const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log("Web server running"));

function createBot() {

  const bot = mineflayer.createBot({
    host: "Novasmpmc.aternos.me",
    port: 21729,
    username: "AFK_BOT",
    version: false,
    auth: "offline" // 🔥 IMPORTANT FOR CRACKED
  });

  // =========================
  // ✅ LOGIN CONFIRM
  // =========================
  bot.on('login', () => {
    console.log("✅ Logged in");
  });

  // =========================
  // ✅ SPAWN
  // =========================
  bot.once('spawn', () => {
    console.log("🤖 Bot joined");

    // =========================
    // 🔐 AUTHME (REGISTER + LOGIN)
    // =========================
    const password = "123456"; // 👈 change kar sakta hai

    setTimeout(() => {
      bot.chat(`/register ${password} ${password}`);
    }, 3000);

    setTimeout(() => {
      bot.chat(`/login ${password}`);
    }, 6000);

    // =========================
    // 🚶 FIRST MOVE (anti mute)
    // =========================
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    // =========================
    // 🤖 ANTI AFK SYSTEM (STABLE)
    // =========================
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
        if (Math.random() < 0.4) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
        }

      } catch (err) {
        console.log("Loop error:", err.message);
      }

    }, 7000); // 🔥 slow = stable

  });

  // =========================
  // 🔁 AUTO RECONNECT (SAFE)
  // =========================
  bot.on('end', () => {
    console.log("❌ Disconnected → Reconnecting...");
    setTimeout(createBot, 20000); // 🔥 important delay
  });

  // =========================
  // ⚠️ ERRORS
  // =========================
  bot.on('kicked', (reason) => {
    console.log("⚠️ Kicked:", reason);
  });

  bot.on('error', (err) => {
    console.log("❌ Error:", err.message);
  });

}

// 🚀 START
createBot();
