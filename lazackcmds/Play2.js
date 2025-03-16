let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Enter the title or YouTube link!\nExample: *${usedPrefix + command} Faded Alan Walker*`);

  await m.reply("🔄 Please wait while I search for the audio...");
  try {
    // Replace ytSearch with your own API call
    const searchResponse = await fetch(`https://api.apify.com/v2/acts/easyapi~youtube-video-and-mp3-downloader/runs?token=$AIzaSyD00_9u1ApXlOKYqwBTn_ztMkCOGTw4RUU/search?query=${encodeURIComponent(text)}`);`);
    const search = await searchResponse.json();
    
    // Ensure search.videos is defined and is an array with at least one element
    if (!search.videos || !Array.isArray(search.videos) || search.videos.length === 0) {
      return m.reply("❌ No results found! Please try again with a different query.");
    }

    const video = search.videos[0];

    if (video.seconds >= 3600) return m.reply("❌ Video duration exceeds 1 hour. Please choose a shorter video!");

    // Replace youtube(video.url) with your own API call
    let audioUrl;
    try {
      const audioResponse = await fetch(`https://api.apify.com/v2/acts/easyapi~youtube-video-and-mp3-downloader/runs?token=$AIzaSyD00_9u1ApXlOKYqwBTn_ztMkCOGTw4RUU/download?url=${encodeURIComponent(video.url)}`)
      const audio = await audioResponse.json();
      audioUrl = audio.mp3;
      if (!audioUrl) throw new Error("Audio URL not found");
    } catch (error) {
      return m.reply("⚠️ Failed to fetch audio. Please try again later.");
    }

    // Send audio file
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        contextInfo: {
          externalAdReply: {
            title: video.title,
            body: "",
            thumbnailUrl: video.image,
            sourceUrl: video.url,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (error) {
    m.reply(`❌ Error: ${error.message}`);
  }
};

handler.help = ["play2"];
handler.tags = ["downloader"];
handler.command = /^play2$/i;

export default handler;
