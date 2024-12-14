require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')
const UserModel = require('./models.js');

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

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === '/start') {
        try{
            await UserModel.create({chatId});
            const db = await UserModel.findOne({chatId: chatId})
            console.log(db)
            db.basket = {body:[]};
            db.save();
        }
        catch (err){
            const db = await UserModel.findOne({chatId: chatId})
            console.log(db)
        }
        return bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
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
                return bot.sendMessage(5106439090, "Что то купили")
            }, 1000)
        } catch (e) {
            console.log(e);
        }
    }

});


app.post('/basket', async (req, res) => {
    const {method, mainData, user} = req.body;
    if(method ==='add'){
    try {
        const chatId = user.id;
        const userDb = await UserModel.findOne({chatId:chatId});
        userDb.basket.body = [...userDb.basket.body, ...[mainData]];
        userDb.safe();
        return res.status(200).json({body: userDb.basket.body});
    } catch (e) {
        return res.status(500).json({});
    }}
})

start()

app.get('/web-data', async (req, res) =>{
    res.send({id:0, massage:'OK'})
});
