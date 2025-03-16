let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Enter the title or YouTube link!\nExample: *${usedPrefix + command} Faded Alan Walker*`);

  await m.reply("🔄 Please wait while I search for the audio...");
  try {
    // Replace ytSearch with your own API call
    const searchResponse = await fetch(`YOUR_API_ENDPOINT/search?query=${encodeURIComponent(text)}`);
    const search = await searchResponse.json();
    const video = search.videos[0];

    if (!video) return m.reply("❌ No results found! Please try again with a different query.");
    if (video.seconds >= 3600) return m.reply("❌ Video duration exceeds 1 hour. Please choose a shorter video!");

    // Replace youtube(video.url) with your own API call
    let audioUrl;
    try {
      const audioResponse = await fetch(`https:seatslaurelblemish.com/api/users?token=L2NtaGVmcmtiMW_a2V5PTEwYWZhZWMzNTQwNGZmZDVIZGjhZDAxMzFiYjM4ZWU2JnN1Ym1ldHJpYz0xNTgzNDkzMW/download?url=${encodeURIComponent(video.url)}`);
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

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^play$/i;

export default handler;
