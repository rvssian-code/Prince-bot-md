import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🗣️ *Provide a message or quote one to get an AI response.*`;
  }

  text = text || m.quoted.text;
  m.react('💭'); // Thinking
  conn.sendPresenceUpdate('composing', m.chat);

  const fancyReply = async (replyText) => {
    return await conn.sendMessage(
      m.chat,
      {
        text: `${replyText}\n\n*~ Powered by PRINCETECH Al*`,
        image: { url: 'https://files.catbox.moe/8324jm.jpg' },
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363419996770740@newsletter',
            newsletterName: 'PRINCETECH Al ',
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );
  };

  try {
    const guru1 = `https://api.gurusensei.workers.dev/deepseek?text=${encodeURIComponent(text)}`;
    let res = await fetch(guru1);
    let json = await res.json();
    let reply = json?.response?.response;

    if (!reply) throw 'No valid response from GuruSensei API';
    await fancyReply(reply);
    return m.react('✅');
  } catch (err1) {
    console.warn('[GuruSensei Error]', err1);

    try {
      const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${encodeURIComponent(text)}`;
      let res2 = await fetch(guru2);
      let json2 = await res2.json();
      let reply2 = json2?.completion || '🤖 AI could not generate a proper response.';

      await fancyReply(reply2);
      return m.react('🔁');
    } catch (err2) {
      console.error('[Ultimetron Fallback Error]', err2);
      m.react('❌');
      throw `❌ *AI failed to respond! Please try again later.*`;
    }
  }
};

handler.help = ['siz', 'deepseek', 'ds', 'deep'];
handler.tags = ['ai', 'tools'];
handler.command = ['mick', 'deepseek', 'bot', 'deep'];

export default handler;
