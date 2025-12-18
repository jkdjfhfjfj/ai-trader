const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
require('dotenv').config();

const client = new TelegramClient(
    new StringSession(process.env.TG_SESSION), 
    parseInt(process.env.TG_API_ID), 
    process.env.TG_API_HASH, 
    {}
);

(async () => {
    await client.connect();
    try {
        // Use ONLY the part after the +
        const hash = "O441Cu8XzwU0NDQ0"; 
        
        const result = await client.invoke(
            new Api.messages.ImportChatInvite({
                hash: hash
            })
        );
        console.log("✅ Successfully joined the private channel!");
    } catch (err) {
        if (err.errorMessage === "USER_ALREADY_PARTICIPANT") {
            console.log("ℹ️ You are already a member of this channel.");
        } else {
            console.error("❌ Error joining:", err.errorMessage);
        }
    }
    process.exit(0);
})();
