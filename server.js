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
    transports: ['websocket', 'polling']
});

app.use(express.static('public'));

// Global State now includes 'reason' fields
let systemState = { 
    tg: 'OFFLINE', 
    ai: 'OFFLINE', 
    tgReason: 'Initializing...', 
    aiReason: 'Initializing...' 
};
const messageHistory = [];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function analyzeSignal(text) {
    try {
        const result = await aiModel.generateContent(`Analyze: ${text}`);
        const response = await result.response;
        systemState.ai = 'ONLINE';
        systemState.aiReason = 'Gemini API Connected';
        return JSON.parse(response.text().replace(/```json|```/g, "").trim());
    } catch (e) {
        systemState.ai = 'OFFLINE';
        systemState.aiReason = e.message; // Capture AI Error
        return { is_signal: false };
    }
}

function broadcastStatus() {
    io.emit('system_status', {
        ...systemState,
        time: new Date().toLocaleTimeString()
    });
}

async function startBridge() {
    const client = new TelegramClient(
        new StringSession(process.env.TG_SESSION || ""), 
        parseInt(process.env.TG_API_ID), 
        process.env.TG_API_HASH, 
        { connection: ConnectionTCPFull, autoReconnect: true }
    );

    try {
        await client.connect();
        systemState.tg = 'ONLINE';
        systemState.tgReason = 'Connected to DC';
    } catch (e) {
        systemState.tg = 'OFFLINE';
        systemState.tgReason = e.message; // Capture TG Error (e.g. Broken Key)
    }

    client.addEventHandler(async (event) => {
        // ... (standard handler remains same)
    }, new NewMessage({}));

    setInterval(broadcastStatus, 5000); // Fast updates for debugging
}

io.on('connection', (socket) => {
    messageHistory.forEach(m => socket.emit('new_event', m));
    broadcastStatus(); 
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LIVE ON PORT ${PORT}`);
    startBridge();
});
