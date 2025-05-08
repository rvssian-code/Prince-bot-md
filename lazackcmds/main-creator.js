let handler = async (m, { conn }) => {
    let vcard = `
  BEGIN:VCARD
  VERSION:3.0
  N:;PRINCE;;;
  FN:PRINCE 
  ORG:PRINCE
  TITLE:
  TEL;waid=0654003502
  X-ABLabel:PRINCE
  X-WA-BIZ-DESCRIPTION:
  X-WA-BIZ-NAME:PRINCE
  END:VCARD
    `.trim();
  
    await conn.sendMessage(
      m.chat,
      {
        contacts: {
          displayName: "PRINCE-TECH",
          contacts: [{ vcard }],
        },
      },
      { quoted: m }
    );
  };
  
  handler.help = ["owner"];
  handler.tags = ["main"];
  handler.command = ["owner", "creator",];
  
  export default handler;
  
