import axios from "axios";
import { load } from 'dotenv';
import { ElevenLabs, play } from 'elevenlabs';

load();

const client = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const tts = async (query, voiceModel) => {
  try {
    const audio = await client.textToSpeech.convert({
      text: query,
      voiceId: voiceModel,
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
    });
    play(audio);
    return audio;
  } catch (error) {
    console.error("Error details:", error.message);
    throw new Error("Failed to generate voice-over. Check the console for details.");
  }
};

let handler = async (message, { conn, text, args, usedPrefix, command }) => {
  let messageText = text || (message.quoted && message.quoted.text);

  if (!messageText) {
    return message.reply("Reply with message or type .tts hello mr lazack device");
  }

  const textChunks = [];
  for (let i = 0; i < messageText.length; i += 500) {
    const chunk = messageText.slice(i, i + 500);
    textChunks.push(chunk);
  }

  message.react("⏳");

  try {
    for (const chunk of textChunks) {
      const audio = await tts(chunk, "JBFqnCBsd6RMkjVDRZzb");
      await conn.sendMessage(message.chat, {
        audio: audio,
        mimetype: "audio/mp4",
        ptt: true
      }, {
        quoted: message
      });
    }
  } catch (error) {
    message.reply("An error occurred while generating the voice-over. Check the console for details.");
    console.error("Detailed error:", error);
  }

  message.react("✅");
};

handler.help = ["tooltts"];
handler.tags = ["tools"];
handler.command = ["speak", "tt"];

export default handler;
