const mineflayer = require('mineflayer');
const express = require('express');
const dns = require('dns');

// =========================
// 🌐 DNS FORCE (Render fix)
dns.setServers(['8.8.8.8', '1.1.1.1', '9.9.9.9']);

// =========================
// 🌐 EXPRESS WEB SERVER
const app = express();
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// =========================
// 🔥 BOT FUNCTION
function createBot() {
    console.log("🚀 Starting bot...");

    const bot = mineflayer.createBot({
        host: "Novasmpmc.aternos.me", // Aternos domain only
        username: "AFK_BOT",
        version: false,
        auth: "offline",
        connectTimeout: 60000, // 60 sec for stable connect
    });

    // =========================
    // LOGIN
    bot.on('login', () => {
        console.log("✅ Logged in");
    });

    // =========================
    // SPAWN + AUTHME + FIRST MOVE
    bot.once('spawn', () => {
        console.log("🤖 Bot joined server");

        const password = "123456";

        // AuthMe register/login
        setTimeout(() => bot.chat(`/register ${password} ${password}`), 4000);
        setTimeout(() => bot.chat(`/login ${password}`), 7000);

        // Tiny forward move to avoid AFK kick
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 2000);

        // =========================
        // ANTI-AFK LOOP
        setInterval(() => {
            try {
                // 👀 Random Look
                const yaw = Math.random() * Math.PI * 2;
                const pitch = Math.random() * 1.2 - 0.6;
                bot.look(yaw, pitch, true);

                // 🚶 Random Movement
                const actions = ['forward', 'back', 'left', 'right'];
                const action = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(action, true);
                setTimeout(() => bot.setControlState(action, false), 1500); // longer for stability

                // 🦘 Random Jump
                if (Math.random() < 0.15) {
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 300);
                }

            } catch (err) {
                console.log("Loop error:", err.message);
            }
        }, 15000); // 15 sec interval for stability

        // =========================
        // KEEP-ALIVE PING
        setInterval(() => {
            if (bot && bot.connected) {
                bot._client.write('keep_alive', { keepAliveId: Date.now() });
            }
        }, 60000); // every 1 min
    });

    // =========================
    // RECONNECT SYSTEM
    bot.on('end', () => {
        console.log("❌ Disconnected → retry in 30s");
        setTimeout(createBot, 30000);
    });

    bot.on('kicked', reason => console.log("⚠️ Kicked:", reason));
    bot.on('error', err => console.log("❌ Error:", err.code || err.message));
}

// =========================
// START BOT
createBot();
