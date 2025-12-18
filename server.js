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
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ['polling', 'websocket']
});

app.use(express.static('public'));

// Global State
let systemState = { tg: 'OFFLINE', ai: 'OFFLINE', tgErr: null, aiErr: null };
const messageHistory = [];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- AI Analysis Function ---
async function analyzeSignal(text) {
    const prompt = `Analyze: "${text}". Must have Pair, BUY/SELL, SL, and TPs. Return ONLY JSON: {"is_signal":boolean, "pair":"string", "action":"BUY"|"SELL", "sl":"string", "tp":["string"], "confidence":number}`;
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        systemState.ai = 'ONLINE';
        return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (e) {
        systemState.ai = 'OFFLINE';
        systemState.aiErr = e.message;
        return { is_signal: false };
    }
}

// --- Health Check Broadcast ---
function broadcastStatus(isManual = false) {
    io.emit('system_status', {
        ...systemState,
        time: new Date().toLocaleTimeString(),
        isManual
    });
}

// --- Telegram Bridge ---
async function startBridge() {
    const client = new TelegramClient(
        new StringSession(process.env.TG_SESSION || ""), 
        parseInt(process.env.TG_API_ID), 
        process.env.TG_API_HASH, 
        { connection: ConnectionTCPFull, autoReconnect: true, connectionRetries: 5 }
    );

    try {
        await client.connect();
        systemState.tg = 'ONLINE';
        systemState.tgErr = null;
        console.log("✅ Telegram Connected");
        
        // Auto-join logic
        try {
            const target = process.env.TARGET_CHANNEL || "forex_signals";
            await client.invoke(new Api.channels.JoinChannel({ channel: target }));
        } catch (e) { console.log("Join check complete."); }

    } catch (e) {
        systemState.tg = 'OFFLINE';
        systemState.tgErr = e.message;
        console.error("❌ TG Connection Error:", e.message);
    }

    client.addEventHandler(async (event) => {
        const msg = event.message;
        if (msg && msg.text) {
            const analysis = await analyzeSignal(msg.text);
            const payload = { 
                title: "Channel Update", 
                text: msg.text, 
                date: new Date().toLocaleTimeString(), 
                id: msg.id.toString(),
                analysis 
            };
            if (messageHistory.length > 50) messageHistory.shift();
            messageHistory.push(payload);
            io.emit('new_event', payload);
        }
    }, new NewMessage({}));

    // Keep-alive loop
    setInterval(async () => {
        try { await client.getMe(); systemState.tg = 'ONLINE'; } 
        catch (e) { systemState.tg = 'OFFLINE'; await client.connect(); }
        broadcastStatus();
    }, 30000);
}

// --- Socket Handlers ---
io.on('connection', (socket) => {
    messageHistory.forEach(m => socket.emit('new_event', m));
    broadcastStatus();
    socket.on('manual_recheck', () => {
        broadcastStatus(true);
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER LIVE ON PORT ${PORT}`);
    startBridge().catch(console.error);
});
