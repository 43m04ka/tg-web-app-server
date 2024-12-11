require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')

const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL  = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const PORT = process.env.PORT || 8000;

const start = async () =>{
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('server started on PORT ' + PORT))
    }catch(err){
        console.log(err);
    }
}

app.use(express.json());
app.use(cors());

bot.setMyCommands([
    { command: "/start", description: "Каталог" }
]);

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
    //const method = req.method;
    //const {user, queryId, products = [], totalPrice} = req.body;
    const data = req.body;
    try {
        //await bot.sendMessage(5106439090, ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')} - @` + user.username);

        //await bot.sendMessage(queryId, ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`);

        return res.status(200).json({data});
    } catch (e) {
        return res.status(500).json({data})
    }
})

start()

app.get('/web-data', function(req, res){
    res.sendStatus(200)
});
