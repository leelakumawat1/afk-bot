const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log("Web server running"));

function createBot() {

  const bot = mineflayer.createBot({
    host: "Novasmpmc.aternos.me, // 👈 CHANGE THIS
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
    console.log("🤖 Bot joined the server");

    // 🔥 Anti GriefPrevention (move first)
    bot.setControlState('forward', true);
    setTimeout(() => bot.setControlState('forward', false), 2000);

    // =========================
    // 🧠 HUMAN-LIKE LOOP
    // =========================
    setInterval(() => {
      try {

        // 👀 SMOOTH LOOK (realistic)
        const yaw = bot.entity.yaw + (Math.random() - 0.5);
        const pitch = Math.max(
          -1.5,
          Math.min(1.5, bot.entity.pitch + (Math.random() - 0.5))
        );
        bot.look(yaw, pitch, true);

        // 🚶 RANDOM MOVEMENT
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];

        bot.setControlState(action, true);

        setTimeout(() => {
          bot.setControlState(action, false);
        }, 1000 + Math.random() * 1000);

        // 🦘 RANDOM JUMP
        if (Math.random() < 0.3) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
        }

      } catch (err) {
        console.log("Loop error:", err.message);
      }

    }, 5000); // 🔥 optimized timing

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
