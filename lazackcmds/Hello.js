export async function all(m) {
  // when someone sends you a hello message
  if (
    (m.mtype === 'hellomessage' ||
      m.text.startsWith('Hello') ||
      m.text.startsWith('Hi') ||
      m.text.startsWith('Mambo') ||
      m.text.startsWith('Oy') ||
      m.text.startsWith('Niaje') ||
      m.text.startsWith('kaka')) &&
    !m.isBaileys &&
    !m.isGroup
  ) {
    // Send a welcome message with mentions
    await this.sendMessage(
      m.chat,
      {
        text: `*KARIBU NA ASANTE KWA KUWASILIANA NAMI*      
        HABARI ZA MDA HUU @${m.sender.split('@')[0]} 
        Napenda kukufahamisha mfumo wetu wa kiautomatic umeboreshwa una weza uka acha ujumbe na si tutajibu haraka iwezekanavyo`.trim(),
      },
      { mentions: [m.sender] }
    );

    // React to the message
    m.react('🖐️');
  }

  return true; // Return true instead of !0 for clarity
     }
