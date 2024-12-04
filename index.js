const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL  = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.setMyCommands([
    { command: "/start", description: "Каталог" }
]);

console.log('123')
bot.on('message', async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === '/start') {

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
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

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})


const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))

app.get('/get-data', function(req, res){
    res.sendStatus(200)
});
