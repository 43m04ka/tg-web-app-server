const TelegramBot = require('node-telegram-bot-api');


const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL  = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === '/start') {

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                keyboard: [
                    [{text: 'Магазин', web_app: {url: webAppURL+'/home'}}]
                ]
            }
        })
    }
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Заказ оформлен, ожидайте нашего сообщениия');
                await bot.sendMessage(5106439090, "Что то купили")
            }, 1000)
        } catch (e) {
            console.log(e);
        }
    }

});
