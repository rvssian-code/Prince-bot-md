import fetch from "node-fetch";
import "@whiskeysockets/baileys";

// Cooldown map to track requests
const cooldown = new Map();

const handler = async (m, { conn, args }) => {
  const sender = m.sender;
  const currentTime = Date.now();
  const lastRequestTime = cooldown.get(sender);
  const cooldownTime = 1200000; // 20 minutes
  const ownerPhoneNumber = process.env.OWNER_PHONE || "254700143167@s.whatsapp.net"; // Use environment variable for owner phone

  // Check cooldown for non-owner users
  if (sender !== ownerPhoneNumber && lastRequestTime && currentTime - lastRequestTime < cooldownTime) {
    const remainingTime = cooldownTime - (currentTime - lastRequestTime);
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return conn.reply(m.chat, `⏳ Please wait ${minutes} minute(s) and ${seconds} second(s) before requesting again.`, m);
  }

  // Validate phone number argument
  if (!args[0]) {
    return conn.reply(m.chat, "📱 Please provide a phone number.\n\n*Example:* *.getpair 254700143167*", m);
  }

  const phoneNumber = args[0].trim();
  const phoneRegex = /^[0-9]{10,15}$/; // Basic validation for phone number

  if (!phoneRegex.test(phoneNumber)) {
    return conn.reply(m.chat, "❌ Invalid phone number. Please provide a valid phone number (10-15 digits).", m);
  }

  const apiUrl = `https://creds-session.onrender.com/pair?phone=${encodeURIComponent(phoneNumber)}`;

  m.reply("⏳ *Retrieving your pairing code... Please wait.*");

  try {
    // Fetch pairing code from the API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch pairing code: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.code) {
      const pairingCode = result.code;
      const message = `
*Mickey bots Pairing Code 🫂*

💬 A verification code has been sent to your phone number. Please check your phone and enter the code to complete pairing.

*🔢 Code:* \`${pairingCode}\`
      `;
      // Send pairing code message
      await conn.reply(m.chat, message, m);

      // Update cooldown
      cooldown.set(sender, currentTime);
    } else if (result.error) {
      conn.reply(m.chat, `⚠️ Error: ${result.error}`, m);
    } else {
      conn.reply(m.chat, `⚠️ Unexpected response format: ${JSON.stringify(result)}`, m);
    }
  } catch (error) {
    conn.reply(m.chat, `❌ Error: ${error.message}`, m);
  }
};

handler.help = ["getpair", "getcode"];
handler.tags = ["tools"];
handler.command = ["getpair", "pair", "paircode"];
handler.owner = false;
handler.private = true;

export default handler;
