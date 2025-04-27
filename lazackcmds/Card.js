let handler = async m => {
  m.reply(
    {
      text: `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣷⣜⢿⣧⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠻⣿⣿⣿⣿⣦⠄⠄
乂───『 *MICKEY-TRONY BOT*』───乂 
> Library : MICKEY INFO TECH
> Version : 2.9.0
> website : https://rosy-cheetah-m2mt9z.mystrikingly.com/
> source : https://github.com/Mickeymozy/Mickey-trony

      If you find error or want to upgrade to premium plan contact to the owner.
      
> Mickey-trony is bot made up by Mickey
  __________________________`,
      buttons: [
        { buttonId: 'sendText1', buttonText: { displayText: 'Send Text 1' }, type: 1 },
        { buttonId: 'sendText2', buttonText: { displayText: 'Send Text 2' }, type: 1 }
      ],
      headerType: 1
    }
  );
};

handler.help = ['ruth'];
handler.tags = ['main'];
handler.command = ['card'];

export default handler;
