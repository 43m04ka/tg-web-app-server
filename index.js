require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')
const {mainData} = require("./models");
const UserModel = require('./models.js').Users;
const DataModel = require('./models.js').Data;
const MainDataModel = require('./models.js').MainData;

const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('server started on PORT ' + PORT))
    } catch (err) {
        console.log(err);
    }
}

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    const text = msg.text;
    if (text === 'bd') {
        const dataDb = await DataModel.findOne({id: 1})
        dataDb.body = {
            body: [{id: 0, page: 'playstation', body: [[], []]}, {
                id: 1,
                page: 'xbox',
                body: [[], []]
            }, {id: 2, page: 'service', body: [[], []]}]
        };
        dataDb.save();
    } else if (text === '/start') {
        try {
            await UserModel.create({chatId: chatId});
            const db = await UserModel.findOne({chatId: chatId})
            console.log(db)
            console.log(chatId)
            db.basket = {body: []};
            db.save();
        } catch (err) {
            const db = await UserModel.findOne({chatId: chatId})
            console.log(chatId)
            console.log(db)
        }
        return bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Магазин', web_app: {url: webAppURL + '/home'}}]
                ]
            }
        })
    }
});


app.post('/admin', async (req, res) => {
    const method = req.body.method;
    if (method === 'login') {
        try {
            const login = req.body.userData.login;
            const password = req.body.userData.password;
            if (login == 'root' && password == '0207') {
                return res.status(200).json({});
            } else {
                return res.status(410).json({});
            }
        } catch (err) {
            return res.status(510).json({});
        }
    } else if (method === 'get') {
        try {
            const dataDb = await DataModel.findOne({id: 1})
            return res.status(200).json(dataDb.body);
        } catch (err) {
            return res.status(411).json({});
        }
    } else if (method === 'set') {
        try {
            const login = req.body.userData.login;
            const password = req.body.userData.password;
            if (login == 'root' && password == '0207') {
                const dataDb = await DataModel.findOne({id: 1});
                dataDb.body = req.body.data;
                dataDb.save();
                console.log(dataDb.body)
                return res.status(200).json(dataDb.body);
            } else {
                return res.status(412).json({});
            }
        } catch (err) {
            return res.status(512).json({});
        }
    }
});

app.post('/basket', async (req, res) => {
    const method = req.body.method;
    if (method === 'add') {
        try {
            const {mainData, user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            let isContinue = true;
            userDb.basket.body.map(el => {
                console.log(el.id, mainData.id, el.title, mainData.title)
                if (el.id === mainData.id && el.title === mainData.title) {
                    isContinue = false;
                    return res.status(200).json({body: true});
                }
            })
            if (isContinue) {
                let summa = {body: [...[mainData], ...userDb.basket.body]};
                await console.log(userDb.basket.body)
                userDb.basket = summa;
                await userDb.save();
                return res.status(200).json({body: true});
            }
        } catch (e) {
            console.log(e)
            return res.status(501).json({body: false});
        }
    } else if (method === 'get') {
        try {
            const {user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            console.log(userDb.basket);
            return res.status(200).json(userDb.basket);
        } catch (e) {
            console.log(e)
            return res.status(502).json({});
        }
    } else if (method === 'del') {
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
        } catch (e) {
            console.log(e)
            return res.status(503).json({});
        }
    } else if (method === 'buy') {
        try {
            const {user} = req.body;
            const chatId = user.id;
            const userDb = await UserModel.findOne({chatId: chatId});
            let userBasket = userDb.basket.body
            let games = ''
            bot.sendMessage(chatId, 'Спасибо за Ваш заказ!\n' +
                '\n' +
                'Менеджер свяжется с Вами в ближайшее рабочее время для активации и оплаты заказа.\n' +
                '\n' +
                'Менеджер — @gwstore_admin. \n' +
                'Часы работы 10:00 — 22:00 по МСК ежедневно.')
            userDb.basket = {body: []};
            userDb.save();
            return res.status(200).json({body: []});
        } catch (e) {
            console.log(e)
            return res.status(503).json({});
        }
    }
})

app.post('/database', async (req, res) => {

    const method = req.body.method;
    if (method === 'add') {
        try {
            const data = req.body.data;
            await data.map(async el => {
                const cardDB = await MainDataModel.create({body: el});
                console.log(cardDB)
            })
            return res.status(200).json({body: true, method: method});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'get') {
        try {
            const cards = await MainDataModel.findAll();
            return res.status(200).json({body: cards, method: method});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    }
})

start()

