const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { ConnectionTCPFull } = require('telegram/network/connection'); // More stable on Render
const { NewMessage } = require('telegram/events');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// FIX 1: Enable CORS for Socket.io to prevent blank UI on Render
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); 

const channelCache = {};
const messageHistory = []; 

async function analyzeSignal(text) {
    const prompt = `Analyze: "${text}". Must have Pair, BUY/SELL, SL, and TPs. Return ONLY JSON: {"is_signal":boolean, "pair":"string", "action":"BUY"|"SELL", "sl":"string", "tp":["string"], "confidence":number, "reason":"string"}`;
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (e) { 
        return { is_signal: false, reason: `AI Error: ${e.message}` }; 
    }
}

async function startBridge() {
    const client = new TelegramClient(
        new StringSession(process.env.TG_SESSION), 
        parseInt(process.env.TG_API_ID), 
        process.env.TG_API_HASH, 
        { 
            connection: ConnectionTCPFull, // Standard connection is better for proxy stability
            autoReconnect: true,
            connectionRetries: 10
        }
    );

    // FIX 2: Specific handler for DC 4 / Broken Key errors
    client.on('error', (err) => {
        if (err.message.includes('authorization key')) {
            console.log("🛠️ Key issue detected. Attempting full client reboot...");
            client.disconnect().then(() => client.connect());
        }
    });

    async function checkHealth(isManual = false) {
        let tgStatus = "ONLINE", tgError = null;
        let aiStatus = "ONLINE", aiError = null;
        try { await client.getMe(); } catch (e) { tgStatus = "OFFLINE"; tgError = e.message; }
        try { await aiModel.generateContent("ping"); } catch (e) { aiStatus = "OFFLINE"; aiError = e.message; }
        const health = { tg: tgStatus, tgErr: tgError, ai: aiStatus, aiErr: aiError, time: new Date().toLocaleTimeString(), isManual };
        io.emit('system_status', health);
        console.log(`[${health.time}] 🏥 Health Update: TG=${tgStatus}, AI=${aiStatus}`);
    }

    async function processEvent(msg, isSync = false) {
        if (!msg || !msg.message) return;
        const rawId = (msg.peerId?.channelId || msg.peerId?.chatId || msg.peerId?.userId || "0").toString();
        const msgTime = new Date().toLocaleTimeString();
        
        if (!channelCache[rawId]) {
            try {
                const entity = await client.getEntity(msg.peerId);
                channelCache[rawId] = entity.title || entity.firstName || rawId;
            } catch (e) { channelCache[rawId] = `ID: ${rawId}`; }
        }

        const analysis = await analyzeSignal(msg.message);
        const payload = { id: rawId, title: channelCache[rawId], text: msg.message, date: msgTime, isSync, analysis };

        if (messageHistory.length > 50) messageHistory.shift();
        messageHistory.push(payload);
        io.emit('new_event', payload);
    }

    io.on('connection', (socket) => {
        messageHistory.forEach(msg => socket.emit('new_event', msg));
        checkHealth();
        socket.on('manual_recheck', () => checkHealth(true));
    });

    await client.connect();
    console.log("✅ Connected to Telegram!");

    // FIX 3: Auto-Join Channel at Startup (Put your target channel username here)
    try {
        const targetChannel = "YOUR_CHANNEL_USERNAME"; // e.g., "forex_signals_daily"
        await client.invoke(new Api.channels.JoinChannel({ channel: targetChannel }));
        console.log(`📡 Join attempt for ${targetChannel} complete.`);
    } catch (e) { console.log("ℹ️ Join check: already joined or private."); }

    const dialogs = await client.getDialogs({ limit: 10 });
    for (const d of dialogs) {
        const msgs = await client.getMessages(d.id, { limit: 5 });
        for (const m of msgs.reverse()) await processEvent(m, true);
