const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log("Web server running"));

function createBot() {

  const bot = mineflayer.createBot({
    host: "Novasmpmc.aternos.me", // 👈 CHANGE THIS
    port: 21729,
    username: "AFK_BOT",
    version: false
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

  // 🔥 FIRST MOVE (very important)
  bot.setControlState('forward', true);
  setTimeout(() => bot.setControlState('forward', false), 2000);

  // =========================
  // 🔄 MAIN LOOP (movement + look)
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
      }, 1500);

      // 🦘 JUMP
      if (Math.random() < 0.4) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }

    } catch (err) {
      console.log("Loop error:", err.message);
    }

  }, 5000);
});

  // =========================
  // 🔁 AUTO RECONNECT (SAFE)
  // =========================
  let retries = 0;

  bot.on('end', () => {
    console.log("❌ Disconnected");

    if (retries < 999) {
      retries++;
      console.log(`🔄 Reconnecting... (${retries})`);
      setTimeout(createBot, 15000); // 🔥 safe delay
    }
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
