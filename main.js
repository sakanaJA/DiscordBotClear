const moment = require('moment');
const { Client, Intents, Permissions, MessageEmbed, Collection } = require('discord.js');
const { readdirSync } = require('fs');

// Discordクライアントの設定
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    disableMentions: 'everyone',
});

// コマンドの読み込み
client.commands = new Collection();
readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});

// メッセージ削除機能
client.on('messageCreate', async message => {
    if (!message.content.startsWith('!clear') || !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

    const args = message.content.split(' ').slice(1); // コマンドの引数を取得
    let targetDate = args[0] ? moment(args[0]) : null; // 引数から日付をパース

    try {
        let fetched = await message.channel.messages.fetch({ limit: 100 });
        let deletableMessages = fetched.filter(m => {
            let messageDate = moment(m.createdAt); // メッセージの作成日時
            return targetDate ? messageDate.isSame(targetDate, 'day') : true; // 日付が指定されていればその日のメッセージのみフィルタ
        });

        await message.channel.bulkDelete(deletableMessages);
        console.log('Messages deleted');
        message.channel.send(`${deletableMessages.size} messages have been deleted.\n${deletableMessages.size}件のメッセージが削除されました。`);
    } catch (error) {
        console.error('Error in message deletion: ', error);
        message.channel.send('メッセージの削除中にエラーが発生しました。');
    }
});

// ボットのログイン
client.login(process.env.TOKEN);
