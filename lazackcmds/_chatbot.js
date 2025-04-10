import Groq from 'groq-sdk';

let handler = (m) => m;

handler.all = async function (m) {
  try {
    if (m.isBaileys || m.sender === m.chat) return;

    const messageBody = m.text || '';
    const bot = conn.user?.jid?.replace('@s.whatsapp.net', '');
    if (!bot) {
      throw new Error("Bot's JID is undefined. Ensure the connection is established.");
    }

    if (!conn.chatbot) conn.chatbot = {};

    if (messageBody.includes('@' + bot)) {
      const userMessage = messageBody.replace('@' + bot, '').trim();
      if (userMessage) {
        if (!(m.sender in conn.chatbot)) {
          conn.chatbot[m.sender] = [
            {
              role: 'system',
              content: `You are Yumi, an 11-year-old cheerful and cute girl. When speaking, she uses soft language and types in a cute, emoticon-filled way with punctuation marks like '^^' or 'owo'.`,
            },
          ];
        }

        // Limit conversation history to the last 10 messages
        if (conn.chatbot[m.sender].length > 10) {
          conn.chatbot[m.sender] = conn.chatbot[m.sender].slice(-10);
        }

        conn.chatbot[m.sender].push({
          role: 'user',
          content: userMessage,
        });

        const payloads = {
          messages: conn.chatbot[m.sender],
          model: 'llama-3.2-90b-vision-preview',
        };

        try {
          const groq = new Groq({ apiKey: global.key?.groq });
          if (!groq || !groq.chat?.completions?.create) {
            throw new Error('Groq SDK configuration is invalid.');
          }

          const json = await groq.chat.completions.create(payloads);
          let responseMessage =
            json?.choices?.[0]?.message?.content ||
            'Sorry, I’m confused and can’t answer that >,<';

          conn.chatbot[m.sender].push({
            role: 'system',
            content: responseMessage,
          });

          await conn.sendMessage(
            m.chat,
            { text: responseMessage },
            { quoted: m }
          );
        } catch (error) {
          console.error('Error interacting with Groq SDK:', error);
          await conn.sendMessage(
            m.chat,
            { text: 'I’m fine, but there was an error >,<.' },
            { quoted: m }
          );
        }
      } else {
        await conn.sendMessage(
          m.chat,
          { text: 'What do you mean??' },
          { quoted: m }
        );
      }
    }
  } catch (error) {
    console.error('Error in handler.all:', error);
  }
  return true;
};

export default handler;
