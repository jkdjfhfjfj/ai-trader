const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { GoogleGenerativeAI } = require("@google-generative-ai/server");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

// AI Setup - Using Lite to avoid Quota Errors
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// Telegram Configuration
const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
const stringSession = new StringSession(process.env.TG_SESSION);
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });

async function extractSignal(text) {
    try {
        const prompt = `Extract trading signal JSON from: "${text}". 
        Return ONLY JSON with: pair, type (BUY/SELL), entry, tp, sl. 
        If not a signal, return {"error": "no signal"}`;
        
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text().replace(/```json|```/g, ""));
    } catch (err) {
        return { error: "AI processing failed" };
    }
}

async function startBridge() {
    await client.connect();
    console.log("Connected to Telegram");

    client.addEventHandler(async (event) => {
        const message = event.message;
        if (message && message.text) {
            const rawText = message.text;
            io.emit("raw_signal", { text: rawText, time: new Date().toLocaleTimeString() });

            const validated = await extractSignal(rawText);
            if (!validated.error) {
                io.emit("validated_signal", validated);
            }
        }
    });
}

// RENDER FIX: Use dynamic port and 0.0.0.0 host binding
const PORT = process.env.PORT || 2000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
    startBridge().catch(console.error);
});
