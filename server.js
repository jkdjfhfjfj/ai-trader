const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { ConnectionTCPObfuscated } = require('telegram/network/connection');
const { NewMessage } = require('telegram/events');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));

// UPDATED TO GEMINI 2.0 FLASH
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
        { connection: ConnectionTCPObfuscated, autoReconnect: true }
    );

    async function checkHealth(isManual = false) {
        let tgStatus = "ONLINE", tgError = null;
        let aiStatus = "ONLINE", aiError = null;

        try { await client.getMe(); } 
        catch (e) { tgStatus = "OFFLINE"; tgError = e.message; }
        
        try { await aiModel.generateContent("ping"); } 
        catch (e) { aiStatus = "OFFLINE"; aiError = e.message; }

        const health = { 
            tg: tgStatus, tgErr: tgError, 
            ai: aiStatus, aiErr: aiError, 
            time: new Date().toLocaleTimeString(),
            isManual: isManual 
        };
        
        console.log(`[${health.time}] 🏥 Health: TG=${tgStatus}, AI=${aiStatus}`);
        io.emit('system_status', health);
    }

    async function processEvent(msg, isSync = false) {
        if (!msg || !msg.message) return;
        const rawId = (msg.peerId.channelId || msg.peerId.chatId || msg.peerId.userId || "0").toString();
        const msgTime = new Date().toLocaleTimeString();
        
        if (!channelCache[rawId]) {
            try {
                const entity = await client.getEntity(msg.peerId);
                channelCache[rawId] = entity.title || entity.firstName || rawId;
            } catch (e) { channelCache[rawId] = `ID: ${rawId}`; }
        }

        const analysis = await analyzeSignal(msg.message);
        const payload = {
            id: rawId, title: channelCache[rawId], text: msg.message,
            date: msgTime, isSync: isSync, analysis: analysis
        };

        if (messageHistory.length > 100) messageHistory.shift();
        messageHistory.push(payload);
        io.emit('new_event', payload);
        console.log(`[${msgTime}] [${isSync ? 'SYNC' : 'LIVE'}] ${channelCache[rawId]} processed.`);
    }

    io.on('connection', (socket) => {
        messageHistory.forEach(msg => socket.emit('new_event', msg));
        checkHealth();
        socket.on('manual_recheck', () => checkHealth(true));
    });

    await client.connect();
    const dialogs = await client.getDialogs({ limit: 10 });
    for (const d of dialogs) {
        const msgs = await client.getMessages(d.id, { limit: 5 });
        for (const m of msgs.reverse()) await processEvent(m, true);
    }

    client.addEventHandler((ev) => processEvent(ev.message, false), new NewMessage({}));
    setInterval(checkHealth, 30000);
}

server.listen(2000, () => startBridge().catch(console.error));
