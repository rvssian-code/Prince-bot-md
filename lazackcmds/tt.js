import axios from "axios";

const model = ["bella", "echilling", "adam", "prabowo", "thomas_shelby", "michi_jkt48", "jokowi", "megawati", "nokotan", "boboiboy", "yanzgpt"];

const tts = (query, voiceModel) => {
  return new Promise(async (resolve, reject) => {
    if (!model.includes(voiceModel)) {
      return reject(new Error("Invalid voice model."));
    }

    try {
      const response = await axios.get("https://api.yanzbotz.live/api/tts/voice-over", {
        params: {
          query: query,
          model: voiceModel,
          apiKey: "PrincelovesYanz"
        },
        responseType: "arraybuffer"
      });

      resolve(response.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      console.error("Error details:", errorMessage);
      reject(new Error("Failed to generate voice-over. Check the console for details."));
    }
  });
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
      const audio = await tts(chunk, "thomas_shelby");
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
