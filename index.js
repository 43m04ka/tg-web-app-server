require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')
const UserModel = require('./models.js').Users;
const DataModel = require('./models.js').Data;

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
    if(text==='bd'){
        const dataDb = await DataModel.findOne({id:1})
        dataDb.body = {body: [{id: 0, page: 'playstation', body: [[], []]}, {id: 1, page: 'xbox', body: [[], []]}]};
        dataDb.save();
    }
    if(text === '/start') {
        try{
            await UserModel.create({chatId: chatId});
            const db = await UserModel.findOne({chatId: chatId})
            console.log(db)
            console.log(chatId)
            db.basket = {body:[]};
            db.save();
        }
        catch (err){
            const db = await UserModel.findOne({chatId: chatId})
            console.log(chatId)
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


app.post('/admin', async (req, res) => {
    const method = req.body.method;
    if(method === 'login'){
        const login = req.body.userData.login;
        const password = req.body.userData.password;
        console.log(login+password)

        if(login == 'root' && password == '0207'){
            return res.status(200).json({});
        }else{
            return res.status(410).json({});
        }
    }else if(method === 'get'){
        const login = req.body.userData.login;
        const password = req.body.userData.password;
        if(login == 'root' && password == '0207'){
            const dataDb = await DataModel.findOne({id:1})
            console.log(dataDb)
            return res.status(200).json(dataDb.body);
        }else{
            return res.status(411).json({});
        }
    }else if(method === 'set'){
        const login = req.body.userData.login;
        const password = req.body.userData.password;
        if(login == 'root' && password == '0207'){
            const dataDb = await DataModel.findOne({id:1});
            dataDb.body = req.data;
            dataDb.save();
            return res.status(200).json(dataDb.body);
        }else{
            return res.status(412).json({});
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
            console.log(e)
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
            console.log(e)
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
            console.log(e)
            return res.status(503).json({});
        }
    }
    else if(method === 'buy'){
        try {
            const {user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            let userBasket = userDb.basket.body
            let games = ''
            userBasket.map(el =>{
                return games += el.title
            })
            bot.sendMessage(chatId, games)
            userDb.basket = {body: []};
            userDb.save();
            return res.status(200).json({body: result});
        }catch (e) {
            console.log(e)
            return res.status(503).json({});
        }
    }
})

start()

