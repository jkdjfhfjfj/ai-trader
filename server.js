const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { ConnectionTCPFull } = require('telegram/network/connection');
const { NewMessage } = require('telegram/events');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enable CORS so the UI can connect on Render
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); 

const messageHistory = []; 

async function analyzeSignal(text) {
    const prompt = `Analyze: "${text}". Must have Pair, BUY/SELL, SL, and TPs. Return ONLY JSON: {"is_signal":boolean, "pair":"string", "action":"BUY"|"SELL", "sl":"string", "tp":["string"]}`;
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (e) { 
        return { is_signal: false, reason: "AI Parse Error" }; 
    }
}

async function startBridge() {
    const client = new TelegramClient(
        new StringSession(process.env.TG_SESSION), 
        parseInt(process.env.TG_API_ID), 
        process.env.TG_API_HASH, 
        { connection: ConnectionTCPFull, autoReconnect: true }
    );

    await client.connect();
    console.log("✅ Telegram Connected");

    // RESTORED: Automatic Channel Join on Startup
    try {
        const targetChannel = "YOUR_CHANNEL_USERNAME"; // Change this to your target @username
        await client.invoke(new Api.channels.JoinChannel({ channel: targetChannel }));
        console.log(`📡 Join attempt for ${targetChannel} complete.`);
    } catch (e) {
        console.log("ℹ️ Join check: already in channel or private.");
    }

    client.addEventHandler(async (event) => {
        const msg = event.message;
        if (msg && msg.text) {
            const analysis = await analyzeSignal(msg.text);
            const payload = { text: msg.text, date: new Date().toLocaleTimeString(), analysis };
            
            if (messageHistory.length > 50) messageHistory.shift();
            messageHistory.push(payload);
            io.emit('new_event', payload);
        }
    }, new NewMessage({}));

    // Keep connection alive
    setInterval(async () => { try { await client.getMe(); } catch (e) { await client.connect(); } }, 60000);
}

// RENDER FIX: Bind to 0.0.0.0 and use dynamic PORT
const PORT = process.env.PORT || 2000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SIGNAL BRIDGE LIVE ON PORT ${PORT}`);
    startBridge().catch(console.error);
});
