import axios from "axios";
import lazacksongs from "yt-search";

let handler = async (m, { conn, text, botname }) => {
    if (!text) return m.reply("Please specify a song you want to play.");

    await m.reply("Searching...");

    try {
        let search = await lazacksongs(text);
        let video = search.videos[0];

        if (!video) return m.reply("No results found.");

        let link = video.url;
        let apis = [
            `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
            `https://api.ryzendesu.vip/api/downloader/yymp3?url=${link}`,
        ];

        for (const api of apis) {
            try {
                let { data } = await axios.get(api);
                if (data.status === 200) {
                    let audioUrl = data.result?.downloadUrl || data.url;
                    let songData = {
                        title: data.result?.title || video.title,
                        artist: data.result?.author || video.author.name,
                        thumbnail: data.result?.image || video.thumbnail,
                        videoUrl: link,
                    };

                    await conn.sendMessage(m.chat, {
                        image: { url: songData.thumbnail },
                        caption: `
*Title:* ${songData.title}
*Artist:* ${songData.artist}
*Audio will be sent shortly.*
                        `,
                    }, { quoted: m });

                    await m.reply("Please wait... The audio is being prepared.");

                    await conn.sendMessage(m.chat, {
                        audio: { url: audioUrl },
                        mimetype: "audio/mp4",
                    }, { quoted: m });

                    await m.reply("Enjoy the audio from Mickeytronybot!");

                    return; // Exit the loop once a successful response is processed
                }
            } catch (e) {
                console.error(`API Error (${api}):`, e.message);
                continue; // Skip to the next API if the current one fails
            }
        }

        return m.reply("Sorry, the server failed to find the requested song.");
    } catch (error) {
        console.error("Handler Error:", error.message);
        return m.reply("An error occurred: " + error.message);
    }
};

handler.help = ["play4 <song>"];
handler.tags = ["music"];
handler.command = /^(play|song)$/i;

export default handler;
