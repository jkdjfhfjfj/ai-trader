const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
require('dotenv').config();

const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
const stringSession = new StringSession(""); // Always start fresh

(async () => {
    console.log("--- Telegram Login Tool ---");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text("Enter Phone Number (+1...): "),
        phoneCode: async () => await input.text("Enter the Code from Telegram: "),
        password: async () => await input.text("Enter 2FA Password (if any): "),
        onError: (err) => console.log(err),
    });

    console.log("\n✅ SUCCESS! Copy this String Session:\n");
    console.log(client.session.save()); 
    console.log("\nPaste this into your .env file under TG_SESSION=");
    process.exit(0);
})();
