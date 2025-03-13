import axios from "axios";

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let txt = `I am bot owner `
    conn.sendMessage(m.chat, { text: txt, caption: "1234", footer: "MIRCUS" }, { quoted: m })

    // Add functionality to send photo by link
    if (args[0]) {
        try {
            const response = await axios.get(args[0], { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            await conn.sendMessage(m.chat, { image: buffer, caption: 'https://i.imgur.com/6Hz0hvN.jpeg' }, { quoted: m });
        } catch (error) {
            console.error(error);
            m.reply('Failed to fetch the photo. Please check the link and try again.');
        }
    } else {
        m.reply('Please provide a valid photo link.');
    }
}
handler.command = ['who']
export default handler
