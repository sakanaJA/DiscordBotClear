const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    // コマンドが "!clear" で、メッセージを送ったユーザーが管理者である場合に動作
    if (message.content === '!clear' && message.member.hasPermission('ADMINISTRATOR')) {
        try {
            // チャンネル内のメッセージを全て取得
            let fetched = await message.channel.messages.fetch({limit: 100});
            // メッセージを削除
            message.channel.bulkDelete(fetched);
            console.log('Messages deleted');
        } catch (error) {
            console.error('Error in message deletion: ', error);
        }
    }
});

client.login(process.env.TOKEN);


