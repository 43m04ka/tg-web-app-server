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
    console.log(msg);
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
    const method = req.body.method;
    if(method ==='add'){
        try {
            const {mainData, user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId:chatId});
            let summa ={body :[ ...[mainData], ...userDb.basket.body]};
            await console.log(userDb.basket.body)
            userDb.basket = summa;
            await userDb.save();
            return res.status(200).json({body: userDb.basket.body});
        } catch (e) {
            return res.status(501).json({});
        }}
    else if(method ==='get'){
        try {
            const {user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            console.log(userDb.basket);
            return res.status(200).json(userDb.basket);
        }catch (e) {
            return res.status(502).json({});
        }
    }else if(method === 'del'){
        try {
            const {user, mainData} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            let userBasket = userDb.basket.body
            let deleteItem = [mainData];
            const result = userBasket.filter(person_A => !deleteItem.some(person_B => person_A.id === person_B.id));
            userDb.basket = {body: result || []};
            userDb.save();
            return res.status(200).json({body: result});
        }catch (e) {
            return res.status(503).json({});
        }
    }
})

start()

