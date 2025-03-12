require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')
const UserModel = require('./models.js').User;
const DataModel = require('./models.js').Data;
const CardModel = require('./models.js').CardData;
const CardModel1 = require('./models.js').CardData1;
const PromoModel = require('./models.js').Promo;
const OrderModel = require('./models.js').Order;
const OrderModelPosition = require('./models.js').OrderPosition;

const token = '6964133561:AAFsVUdvH9VhLdqeRBMKEiGiUg1GQHC4-Hg';
const tokenAdmin = '7914083585:AAGfnycmC6mgq_YLZX1nEtykj8VzSp1ctC4';
const webAppURL = 'https://www.gwstorebot.ru';

const bot = new TelegramBot(token, {polling: true});
const botAdmin = new TelegramBot(tokenAdmin, {polling: true});
const app = express();
let StructureData = {}
let CardData = []
let allCategoryListData = []
let CardPreviewData = []
let listDeleteData = []

const PORT = process.env.PORT || 8000;

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        await reload()

        await app.listen(PORT, () => console.log('server started on PORT ' + PORT))
    } catch (err) {
        console.log(err);
    }
}

app.use(express.json());
app.use(cors());

bot.on("video", async video => {

    console.log(video);

})

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    const text = msg.text;
    if (text === 'bd') {
        try {
            const dataDb = await DataModel.findOne()
            dataDb.body = {
                body: [{id: 0, page: 'playstation', body: [[], []]}, {
                    id: 1,
                    page: 'xbox',
                    body: [[], []]
                }, {id: 2, page: 'service', body: [[], []]}]
            };
            await dataDb.save();
        } catch (e) {
            await DataModel.create({
                body: {
                    body: [{id: 0, page: 'playstation', body: [[], []]}, {
                        id: 1,
                        page: 'xbox',
                        body: [[], []]
                    }, {id: 2, page: 'service', body: [[], []]}]
                }
            })
        }
    } else if (text === '/start') {
        try {
            await UserModel.create({chatId: chatId, basket: []});
            try {
                await bot.sendMessage(5106439090, chatId + ' @' + user.username)
            } catch (e) {

            }
        } catch (err) {
            const db = await UserModel.findOne({chatId: chatId})
        }

        await bot.sendVideo(chatId, 'BAACAgIAAxkBAAJrzWep2ne-f6_hNX8hDLRThdymgTySAAJJYAAClBxRSWOgPyykPcJCNgQ', {
            caption: `<b>Бот Геймворд — это замена PS Store и Xbox Store в России.</b>\n` +
                '\n' +
                'Тысячи позиции в одном приложении. Игры и подписки для PlayStation и XBOX, пополнение Steam, подписки Spotify, Netflix и многое другое. Все цены в рублях. Безопасная оплата картой и чек.\n' +
                '\n' +
                '<b>Канал в Telegram для PS — <a href=\'https://t.me/gameworld_ps\'>ссылка</a>\n' +
                'Канал в Telegram для Xbox — <a href=\'https://t.me/gameworld_xbox\'>ссылка</a>\n' +
                'Наш сайт —  <a href=\'https://gwstore.su\'>геймворд.рф</a>\n' +
                '\n' +
                'Нажмите кнопку «Магазин», чтобы открыть каталог и оформить заказ.</b>',
            disable_web_page_preview: true,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Магазин', web_app: {url: webAppURL + '/home0'}}],
                    [{text: 'Отзывы о нас', url: 'https://gwstore.su/reviews'}],
                    [{text: 'Поддержка бота', url: 'https://t.me/gwstore_admin'}]
                ]
            }
        },);
    } else if (text === '/request') {
        let dataRequestDatabase = {
            userName: 'Admin-bot',
            password: '49ODAvir',
        }

        const sendRequestDatabase = useCallback(() => {
            fetch('https://alfa.rbsuat.com/payment/rest/register.do', {
                method: 'POST',
                body: JSON.stringify(dataRequestDatabase)
            }).then(r => {
                let Promise = r.json()
                Promise.then(prom => {
                    console.log(prom)
                })
            })
        }, [dataRequestDatabase])

        sendRequestDatabase()
    } else if (text === '/dr9j8j98ejw9e8fj-=91f8') {
        try {
            let allCards = await CardModel1.findAll()
            for (let i = 0; i < CardData.length; i++) {
                let card = CardData[i]
                let flag = true
                console.log(allCards.length)
                allCards.map(async el => {
                    if (card.name === el.name && card.body.platform === el.body.platform && card.body.img === el.body.img && card.body.category === el.body.category && card.body.view === el.body.view && card.body.region === el.body.region) {
                        if (!el.category.includes(card.category)) {
                            flag = false
                            let cardDb = await CardModel1.findByPk(el.id)
                            cardDb.category = [...cardDb.category, card.category]
                            let priceArr = [...cardDb.price, card.body.price]
                            cardDb.price = priceArr
                            let body = el.body
                            if (priceArr.length > 1) {
                                body.price = priceArr.min()
                                body.oldPrice = priceArr.max()
                            }
                            cardDb.body = body
                            await cardDb.save()
                            console.log(cardDb.category, cardDb.price, cardDb.name.slice(0, 20))
                        } else {
                            flag = false
                        }
                    }
                })
                if (flag) {
                    await CardModel1.create({
                        body: card.body,
                        category: [card.category],
                        name: card.name,
                        price: [card.body.price]
                    }).then(r => {
                        allCards = [...allCards, r]
                    })
                }
            }
        } catch (e) {
        }
    } else if (text === '/dr28-=7128e7128e') {
        try {
            await UserModel.findAll().then(async users => {
                users.map(async user => {
                    if (!user) return console.log("User not found");
                    await user.getOrders().then(async orders => {
                        for (order of orders) {
                            let orderData = {id: order.id, summa: order.summa, date: order.date, body: []}
                            if (order.id === 83) {
                                console.log(order, user)
                            }
                            await order.getOrderPositions().then(async orderPoss => {
                                for (orderPos of orderPoss) {
                                    orderData.body = [...orderData.body, orderPos.body]
                                }
                            })
                                .catch(err => console.log(err));
                        }
                    })
                        .catch(err => console.log(err));
                })
            }).catch(err => console.log(err));
        } catch (e) {

        }
    } else if (text === '/dr3182e8129e812-=e9') {
        try {
            await bot.sendMessage(1962567079, 'Добрый день! К сожалению Ваш аккаунт Telegram закрытый и мы не можем написать первыми. Напишите, пожалуйста, администратору @gwstore_admin.')
            await bot.sendMessage(5106439090, 'Добрый день! К сожалению Ваш аккаунт Telegram закрытый и мы не можем написать первыми. Напишите, пожалуйста, администратору @gwstore_admin.')
        } catch (e) {

        }
    }
});

app.post('/admin', async (req, res) => {
    const method = req.body.method;
    console.log(req)
    if (method === 'login') {
        try {
            const login = req.body.userData.login;
            const password = req.body.userData.password;
            if (login === 'root' && password === '0207') {
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
            if (login === 'root' && password === '0207') {
                const dataDb = await DataModel.findOne({id: 1});
                dataDb.body = req.body.data;
                await dataDb.save();
                await reload()
                return res.status(200).json(req.body.data);
            } else {
                return res.status(412).json({});
            }
        } catch (err) {
            return res.status(512).json({});
        }
    } else if (method === 'sendMessage') {
        try {
            await bot.sendMessage(req.body.data.chatId, 'Добрый день! К сожалению Ваш аккаунт Telegram закрытый и мы не можем написать первыми. Напишите, пожалуйста, администратору @gwstore_admin.')
            return res.status(201).json();
        } catch (e) {
            return res.status(400).json();
        }
    }
});

app.post('/promo', async (req, res) => {
    const method = req.body.method;
    if (method === 'use') {
        try {
            const promo = req.body.data.str;
            const promoDb = await PromoModel.findOne({where: {body: promo}})
            let count = promoDb.number
            if (count !== 0) {
                promoDb.number = count - 1
                promoDb.save()
                return res.status(200).json({answer: true, parcent: promoDb.parcent});
            } else {
                return res.status(200).json({answer: true, parcent: 0});
            }
        } catch (err) {
            return res.status(510).json({answer: false});
        }
    }
    if (method === 'add') {
        try {
            const str = req.body.data.str;
            const count = req.body.data.count;
            const par = req.body.data.parcent;
            await PromoModel.create({body: str, number: count, numberLocal: count, parcent: par});
            return res.status(200).json({answer: true});
        } catch (err) {
            return res.status(510).json({});
        }
    }
    if (method === 'get') {
        try {
            let all = await PromoModel.findAll();
            return res.status(200).json({promo: all});
        } catch (err) {
            return res.status(510).json({});
        }
    }
    if (method === 'del') {
        const id = req.body.data.id;
        try {
            await PromoModel.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({});
        } catch (err) {
            return res.status(510).json({});
        }
    }
});

app.post('/basket', async (req, res) => {
        const method = req.body.method;
        if (method === 'add') {
            try {
                const {mainData, user} = req.body;
                const chatId = String(user.id);
                const userDb = await UserModel.findOne({where: {chatId: chatId}});
                let isContinue = true;
                userDb.basket.map(el => {
                    if (el === mainData) {
                        isContinue = false;
                        return res.status(200).json({body: true});
                    }
                })
                if (isContinue) {
                    userDb.basket = [...[mainData], ...userDb.basket];
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
                const chatId = String(user.id);
                try {
                    await UserModel.create({chatId: chatId, basket: []});
                    try {
                        await bot.sendMessage(5106439090, chatId + ' @' + user.username)
                    } catch (e) {

                    }
                    console.log('123')
                    return res.status(200).json({body: []});
                } catch (err) {
                    const userDb = await UserModel.findOne({where: {chatId: chatId}});
                    console.log(userDb.basket)
                    let newArray = []
                    CardData.map(card => {
                        userDb.basket.map(el => {
                            if (card.id === el) {
                                newArray = [...newArray, card]
                            }
                        })
                    })
                    await console.log(newArray);
                    return res.status(200).json({body: newArray});
                }
            } catch (e) {
                console.log(e)
                return res.status(502).json({});
            }
        } else if (method === 'del') {
            try {
                const {user, mainData} = req.body;
                const chatId = String(user.id);
                const userDb = await UserModel.findOne({where: {chatId: chatId}});
                let userBasket = userDb.basket
                let deleteItem = [mainData];
                const result = userBasket.filter(a => !deleteItem.some(b => a === b));
                userDb.basket = result || [];
                userDb.save();

                let newArray = []
                CardData.map(card => {
                    userDb.basket.map(el => {
                        if (card.id === el) {
                            newArray = [...newArray, card]
                        }
                    })
                })
                return res.status(200).json({body: newArray});
            } catch (e) {
                console.log(e)
                return res.status(503).json({});
            }
        } else if (method === 'buy') {
            try {
                const {user, accData, page} = req.body;
                const chatId = String(user.id);

                const userDb = await UserModel.findOne({where: {chatId: chatId}});

                let userBasket = []
                CardData.map(card => {
                    userDb.basket.map(el => {
                        if (card.id === el && card.body.tab === page && card.body.isSale) {
                            userBasket = [...userBasket, card]
                        }
                    })
                })

                userDb.basket = []
                await userDb.save();

                let sumPrice = 0.0

                userBasket.map(pos => {
                    sumPrice += parseFloat(pos.body.price)
                })
                if (sumPrice > 0) {
                    let orderId = 'error';

                    await UserModel.findOne({where: {chatId: chatId}}).then(async user => {
                        await user.createOrder({
                            summa: sumPrice,
                            date: new Date().toLocaleDateString(),
                            preview: userBasket[0].body.title,
                            status: 1
                        }).then(async res => {
                            orderId = res.id;
                            userBasket.map(async el => {
                                await OrderModelPosition.create({
                                    body: el,
                                    orderId: orderId
                                }).catch(err => console.log(err));
                            })
                        }).catch(err => console.log(err));
                    })


                    let resultMassage = ''
                    if (page === 0) {
                        resultMassage += 'Заказ Playstation №' + orderId + '\n\n'
                    } else if (page === 1) {
                        resultMassage += 'Заказ Xbox №' + orderId + '\n\n'
                    } else if (page === 2) {
                        resultMassage += 'Заказ Сервисы №' + orderId + '\n\n'
                    }
                    resultMassage += 'Контакт - ' + user.username + '\n\n'
                    resultMassage += accData + '\n\n'
                    resultMassage += 'Корзина:' + '\n\n'
                    let basketMsg = ''
                    let c = 1
                    userBasket.map(pos => {
                        let positionString = ''
                        if (typeof pos.body.view === 'undefined') {
                            positionString += String(c) + '. ' + pos.body.title + ' '
                            if (typeof pos.body.platform !== 'undefined') {
                                positionString += pos.body.platform + ' '
                            }
                            positionString += '- ' + String(pos.body.price) + 'р'
                            if (typeof pos.body.url !== 'undefined') {
                                positionString += ' / ' + pos.body.url
                            }
                        } else {
                            positionString += String(c) + '. ' + pos.body.title + ' ' + pos.body.view + ' - ' + String(pos.body.price) + 'р'
                        }
                        positionString += '\n'
                        basketMsg += positionString
                        c++
                    })
                    resultMassage += basketMsg

                    try {
                        const promoDb = await PromoModel.findOne({where: {body: req.body.promo}})
                        resultMassage += '\n' + 'Итого к оплате: ' + String(sumPrice - sumPrice * (promoDb.parcent / 100)) + 'р' + '\n'
                        resultMassage += 'Промокод: ' + promoDb.body + '\n'
                        resultMassage += 'Статус: Не оплачен'
                    } catch (e) {
                        resultMassage += '\n' + 'Итого к оплате:' + String(sumPrice) + 'р' + '\n'
                        resultMassage += 'Статус: Не оплачен'
                    }

                    if (basketMsg !== '') {
                        await botAdmin.sendMessage(5242902575, resultMassage)
                        await bot.sendMessage(5106439090, resultMassage)

                        let bsMsg = ''
                        let r = 1

                        userBasket.map(pos => {
                            if (typeof pos.body.view === 'undefined') {
                                bsMsg += String(r) + '. ' + pos.body.title + ' '
                                bsMsg += '- ' + String(pos.body.price) + 'р' + '\n'
                            } else {
                                bsMsg += String(r) + '. ' + pos.body.title + ' ' + pos.body.view + ' - ' + String(pos.body.price) + 'р' + '\n'
                            }
                            r++
                        })

                        try {
                            const promoDb = await PromoModel.findOne({where: {body: req.body.promo}})
                            let parcent = promoDb.parcent
                            bsMsg += '\n' + 'Цена без учёта скидки: ' + String(sumPrice) + 'р' + '\n'
                            bsMsg += 'Скидка: ' + String(sumPrice * (parcent / 100)) + 'р' + '\n'
                            bsMsg += 'Итого: ' + String(sumPrice - sumPrice * (parcent / 100)) + 'р' + '\n'
                        } catch (e) {
                            bsMsg += '\n' + 'На сумму: ' + String(sumPrice) + 'р' + '\n'
                        }

                        await bot.sendMessage(chatId, 'Спасибо за Ваш заказ  №' + orderId + '!\n' +
                            '\n' +
                            bsMsg +
                            '\n' +
                            'Менеджер свяжется с Вами в ближайшее рабочее время для активации и оплаты заказа.\n' +
                            '\n' +
                            'Менеджер — @gwstore_admin. \n' +
                            'Часы работы 10:00 — 22:00 по МСК ежедневно.')

                    }
                    return res.status(200).json({body: true, number: orderId});
                }
            } catch
                (e) {
                console.log(e)
                return res.status(503).json({});
            }
        }
    }
)


app.post('/favorites', async (req, res) => {
        const method = req.body.method;
        if (method === 'add') {
            try {
                const {mainData, user} = req.body;
                const chatId = String(user.id);
                const userDb = await UserModel.findOne({where: {chatId: chatId}});
                let isContinue = true;
                userDb.favorites.map(el => {
                    if (el === mainData) {
                        isContinue = false;
                        return res.status(200).json({body: true});
                    }
                })
                if (isContinue) {
                    userDb.favorites = [...[mainData], ...userDb.favorites];
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
                const chatId = String(user.id);
                try {
                    await UserModel.create({chatId: chatId, basket: []});
                    try {
                        await bot.sendMessage(5106439090, chatId + ' @' + user.username)
                    } catch (e) {

                    }
                    console.log('123')
                    return res.status(200).json({body: []});
                } catch (err) {
                    const userDb = await UserModel.findOne({where: {chatId: chatId}});
                    let newArray = []
                    CardData.map(card => {
                        userDb.favorites.map(el => {
                            if (card.id === el) {
                                newArray = [...newArray, card]
                            }
                        })
                    })
                    await console.log(newArray);
                    return res.status(200).json({body: newArray});
                }
            } catch (e) {
                console.log(e)
                return res.status(502).json({});
            }
        } else if (method === 'del') {
            try {
                const {user, mainData} = req.body;
                const chatId = String(user.id);
                const userDb = await UserModel.findOne({where: {chatId: chatId}});
                let userBasket = userDb.favorites
                let deleteItem = [mainData];
                const result = userBasket.filter(a => !deleteItem.some(b => a === b));
                userDb.favorites = result || [];
                userDb.save();

                let newArray = []
                CardData.map(card => {
                    userDb.favorites.map(el => {
                        if (card.id === el) {
                            newArray = [...newArray, card]
                        }
                    })
                })
                return res.status(200).json({body: newArray});
            } catch (e) {
                console.log(e)
                return res.status(503).json({});
            }
        }
    }
)

app.post('/history', async (req, res) => {
    const method = req.body.method;
    if (method === 'get') {
        try {
            const {user} = req.body;
            const chatId = String(user.id);
            let historyData = []

            await UserModel.findOne({where: {chatId: chatId}}).then(async user => {
                if (!user) return console.log("User not found");
                await user.getOrders().then(async orders => {
                    for (order of orders) {
                        let orderData = {id: order.id, summa: order.summa, date: order.date, body: []}
                        await order.getOrderPositions().then(async orderPoss => {
                            for (orderPos of orderPoss) {
                                console.log(orderPos.body.body.title)
                                orderData.body = [...orderData.body, orderPos.body]
                            }
                        })
                            .catch(err => console.log(err));
                        historyData = [...historyData, orderData]
                    }
                })
                    .catch(err => console.log(err));
            }).catch(err => console.log(err));

            let arr = historyData
            let newArr = [], index;
            for (let i = arr.length; i > 0; i--) {
                index = arr.length - i;
                newArr[i] = arr[index];
            }

            return res.status(200).json({body: newArr.slice(1, 15)});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    }
});

app.post('/database', async (req, res) => {

    const method = req.body.method;

    if (method === 'add') {
        try {
            const data = req.body.data;

            let allCards = await CardModel1.findAll()

            for (let i = 0; i < data.length; i++) {
                let card = data[i]
                let flag = true
                allCards.map(async el => {
                    if (card.title === el.name && card.platform === el.body.platform && (card.url === el.body.url || card.img.slice(0, card.img.indexOf('?w=') + 1) === el.body.img.slice(0, card.img.indexOf('?w=') + 1)) && card.category === el.body.category && card.view === el.body.view && card.region === el.body.region) {
                        if (!el.category.includes(card.tabCategoryPath)) {
                            flag = false
                            let cardDb = await CardModel1.findByPk(el.id)
                            cardDb.category = [...cardDb.category, card.tabCategoryPath]
                            let priceArr = [...cardDb.price, card.price]
                            cardDb.price = priceArr
                            let body = el.body
                            if (typeof card.oldPrice !== 'undefined') {
                                body.oldPrice = card.oldPrice
                            }
                            if (typeof card.endDate !== 'undefined') {
                                body.endDate = card.endDate
                            }
                            if (priceArr.length > 1) {
                                body.price = priceArr.min()
                                body.priceMax = priceArr.max()
                            }
                            cardDb.body = body
                            await cardDb.save()
                            console.log(cardDb.category, cardDb.price, cardDb.name.slice(0, 20))
                        } else {
                            flag = false
                        }
                    }
                })
                if (flag) {
                    await CardModel1.create({
                        body: card,
                        category: [card.tabCategoryPath],
                        name: card.title,
                        price: [card.price]
                    }).then(r => {
                        allCards = [...allCards, r]
                    })
                }
            }

            await reload()

            return res.status(200).json({answer: true});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getPreview') {
        try {
            return res.status(200).json({cards: CardPreviewData, structure: StructureData});
        } catch (e) {
            return res.status(550).json({});
        }
    } else if (method === 'getRandom') {
        try {
            const page = req.body.data;
            let randomArray = []
            let tabArray = []

            CardData.map(el => {
                if (el.body.tab === page) {
                    tabArray = [...tabArray, el]
                }
            })

            let count = 0
            let attempt = 0
            if (tabArray.length > 30) {
                while (count < 30) {
                    let randomItem = tabArray[Math.floor(Math.random() * tabArray.length)];
                    let add = true
                    randomArray.map(el => {
                        if (el.body.title === randomItem.body.title) {
                            add = false
                        }
                    })
                    if (add) {
                        randomArray = [...randomArray, randomItem]
                        count++
                    }
                }
            } else {
                randomArray = tabArray
            }
            console.log(randomArray);
            return res.status(200).json({cards: randomArray});
        } catch (e) {
            return res.status(550).json({});
        }

    } else if (method === 'delete') {
        const path = req.body.data;
        const idList = req.body.idList;
        try {
            for (let i = 0; i < CardData.length; i++) {
                let card = CardData[i]
                if (card.category.includes(path)) {
                    if (idList === 'all' || idList.includes(card.id)) {
                        if (card.category.length > 1) {
                            const cardDb = await CardModel1.findByPk(card.id)
                            let category = card.category
                            let index = category.indexOf(path)
                            category.splice(index, 1)
                            cardDb.category = category
                            console.log(category)
                            let arrPrice = card.price
                            arrPrice.splice(index, 1)
                            cardDb.price = arrPrice
                            let body = card.body
                            if (arrPrice.length > 1) {
                                body.price = arrPrice.min()
                            } else {
                                body.price = body.oldPrice
                                delete body.oldPrice
                                delete body.endDate
                            }
                            cardDb.body = body
                            await cardDb.save()
                        } else {
                            await CardModel1.destroy({
                                where: {
                                    id: card.id
                                }
                            })
                        }
                    }
                }
            }

            await reload()
            return res.status(200).json({});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'changeStatus') {
        const path = req.body.data;
        const idList = req.body.idList;
        try {
            let bool = null
            for (let i = 0; i < CardData.length; i++) {
                let card = CardData[i]
                if (card.category.includes(path)) {
                    if (idList === 'all' || idList.includes(card.id)) {
                        if (bool === null) {
                            if (typeof card.body.isSale === 'undefined') {
                                bool = true
                            } else {
                                bool = !card.body.isSale
                            }
                        }
                        const cardDb = await CardModel1.findByPk(card.id)
                        let body = card.body
                        body.isSale = bool
                        cardDb.body = body
                        await cardDb.save()
                    }
                }
            }


            await reload()
            return res.status(200).json({});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getList') {
        try {
            const path = req.body.data.path;
            const number = req.body.data.number;
            if (typeof req.body.data.filter !== 'undefined') {
                const jsonFilter = req.body.data.filter;
                let request = []
                let len = 0
                allCategoryListData.map(cat => {
                    if (cat.path === path) {
                        request = cat.body
                        len = cat.len
                    }
                })

                let allArray = []
                request.map(el => {
                    allArray = [...allArray, ...el]
                })

                request = []
                allArray.map(card => {
                    let add = true
                    if (typeof jsonFilter.platform !== 'undefined') {
                        if (jsonFilter.platform.length !== 0) {
                            let plBol = true
                            jsonFilter.platform.map(platform => {
                                console.log(card.body.platform)
                                if (card.body.platform.includes(platform)) {
                                    plBol = false
                                }
                            })
                            if (plBol) {
                                add = false
                            }
                        }
                    }
                    if (typeof jsonFilter.languageSelector !== 'undefined') {
                        if (jsonFilter.languageSelector.length !== 0) {
                            let plBol = true
                            jsonFilter.languageSelector.map(languageSelector => {
                                console.log(card.body.languageSelector)
                                if (card.body.languageSelector.includes(languageSelector)) {
                                    plBol = false
                                }
                            })
                            if (plBol) {
                                add = false
                            }
                        }
                    }
                    if (typeof jsonFilter.numPlayers !== 'undefined') {
                        if (jsonFilter.numPlayers.length !== 0) {
                            let plBol = true
                            jsonFilter.numPlayers.map(numPlayers => {
                                console.log(card.body.numPlayers)
                                if (String(card.body.numPlayers).includes(numPlayers)) {
                                    plBol = false
                                }
                            })
                            if (plBol) {
                                add = false
                            }
                        }
                    }
                    if (typeof jsonFilter.category !== 'undefined') {
                        if (jsonFilter.category.length !== 0) {
                            let ctBol = true
                            jsonFilter.category.map(cat => {
                                console.log(card.body.category, cat)
                                if (card.body.category.includes(cat) || card.body.category === cat) {
                                    console.log(true)
                                    ctBol = false
                                }
                            })
                            if (ctBol) {
                                add = false
                            }
                        }
                        if (add) {
                            request = [...request, card]
                        }
                    }
                })

                if (jsonFilter.price.sort) {
                    request.sort((a, b) => (+(a.body.price - b.body.price)))
                } else if (!jsonFilter.price.sort) {
                    request.sort((a, b) => (+(b.body.price - a.body.price)));
                }

                let array = request; //массив, можно использовать массив объектов
                let size = 20; //размер подмассива
                let subarray = []; //массив в который будет выведен результат.
                for (let i = 0; i < Math.ceil(array.length / size); i++) {
                    subarray[i] = array.slice((i * size), (i * size) + size);
                }

                return res.status(200).json({cards: subarray[number - 1], len: subarray.length});
            } else {
                let request = []
                let len = 0
                allCategoryListData.map(cat => {
                    if (cat.path === path) {
                        request = cat.body[number - 1]
                        len = cat.len
                    }
                })
                return res.status(200).json({cards: request, len: len});
            }
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'reload') {
        try {
            await reload()
            let allPath = []
            CardData.map(el => {
                el.category.map(elCat => {
                    if (!allPath.includes(elCat)) {
                        allPath.push(elCat)
                    }
                })
            })

            let isSaleArr = []
            for (let j = 0; j < allPath.length; j++) {
                let path = allPath[j]
                isSaleArr.push(false)
                for (let i = 0; i < CardData.length; i++) {
                    let card = CardData[i]
                    if (card.category.includes(path)) {
                        if (card.body.isSale) {
                            isSaleArr[j] = true
                        }
                    }
                }
            }

            return res.status(200).json({structure: StructureData, allCategory: allPath, isSaleArr: isSaleArr});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getSearch') {
        try {
            const str = req.body.data.str;
            const page = req.body.data.page;


            let result = []
            CardData.map(card => {
                try {
                    let newCard = card
                    newCard.dataValues.rating = 0
                    if (card.body.tab === page) {
                        if (card.body.title.toLowerCase().includes(str.toLowerCase())) {
                            let i = (10 - card.body.title.toLowerCase().indexOf(str.toLowerCase()))
                            if (i < 0) {
                                i = 0
                            }
                            newCard.dataValues.rating = str.length + i
                            result = [...result, newCard]
                        } else {
                            let flag = true
                            let rating = 0
                            str.toLowerCase().split(' ').map(s => {
                                if (!card.body.title.toLowerCase().includes(s)) {
                                    flag = false
                                }
                                if (s.length * 2 > rating) {
                                    rating = s.length * 2
                                }
                            })
                            if (flag) {
                                newCard.dataValues.rating = rating
                                result = [newCard, ...result]
                            } else {
                                flag = true
                                rating = 0
                                let substring = ''
                                str.toLowerCase().replaceAll(' ', '').split('').map(s => {
                                    if (!card.body.title.toLowerCase().includes(s)) {
                                        flag = false
                                    }
                                    substring = substring + s
                                    if (card.body.title.toLowerCase().replaceAll(' ', '').includes(substring)) {
                                        rating = substring.length
                                    }
                                })
                                if (flag) {
                                    newCard.dataValues.rating = rating
                                    result = [newCard, ...result]
                                }
                            }
                        }
                    }
                } catch (e) {

                }
            })


            result.sort(function (a, b) {
                try {
                    if (a.dataValues.rating < b.dataValues.rating) {
                        return 1;
                    }
                    if (a.dataValues.rating > b.dataValues.rating) {
                        return -1;
                    }
                } catch (e) {
                }
            })


            return res.status(200).json({cards: result.slice(0, 50)});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'upd') {
        try {
            await req.body.data.map(async el => {
                const card = await CardModel.findByPk(el.id)
                console.log(el, card)
                card.body = el.body
                await card.save();
            })
            return res.status(200).json({});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getDataAdmin') {
        try {
            let allPath = []
            CardData.map(el => {
                el.category.map(elCat => {
                    if (!allPath.includes(elCat)) {
                        allPath.push(elCat)
                    }
                })
            })

            let isSaleArr = []
            for (let j = 0; j < allPath.length; j++) {
                let path = allPath[j]
                isSaleArr.push(false)
                for (let i = 0; i < CardData.length; i++) {
                    let card = CardData[i]
                    if (card.category.includes(path)) {
                        if (card.body.isSale) {
                            isSaleArr[j] = true
                        }
                    }
                }
            }

            return res.status(200).json({structure: StructureData, allCategory: allPath, isSaleArr: isSaleArr});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getOrderHistory') {
        try {
            let allOrders = []
            await UserModel.findAll().then(async users => {
                for (let i = 0; i < users.length; i++) {
                    let user = users[i]
                    await user.getOrders().then(async orders => {
                        for (let order of orders) {
                            let orderData = order
                            orderData.dataValues.body = []
                            orderData.dataValues.chatId = user.chatId
                            await order.getOrderPositions().then(async orderPoss => {
                                for (let orderPos of orderPoss) {
                                    orderData.dataValues.body = [...orderData.dataValues.body, orderPos.body]
                                }
                            })
                                .catch(err => console.log(err));
                            console.log(orderData)
                            allOrders.push(orderData)
                        }
                    })
                        .catch(err => console.log(err));
                }
            }).catch(err => console.log(err));

            console.log(allOrders.length);


            allOrders.sort(function (a, b) {
                try {
                    if (a.id < b.id) {
                        return 1;
                    }
                    if (a.id > b.id) {
                        return -1;
                    }
                } catch (e) {
                }
            })

            return res.status(200).json({allOrders: allOrders.slice(0, 50)});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'editPriceCard') {
        try {
            const id = req.body.data.id;
            const priceArr = req.body.data.priceArray;



            const card = await CardModel1.findByPk(id);
            let newBody = card.dataValues.body
            card.price = priceArr
            await card.save()
            console.log(newBody)

            const card1 = await CardModel1.findByPk(id);
            newBody.price = priceArr.min()
            if(typeof req.body.data.oldPrice !== 'undefined'){
                newBody.oldPrice = req.body.data.oldPrice;
            }
            card1.body = newBody
            await card1.save()

            await reload()

            return res.status(200).json({});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    }
})


const reload = async () => {
    const dataDb = await DataModel.findOne({id: 1})
    StructureData = dataDb.body.body

    let count = 0
    let allCategoryStructure = []
    StructureData[0].body[1].map(el => {
        allCategoryStructure.push(StructureData[0].body[1][count])
        count++
    })
    count = 0
    StructureData[1].body[1].map(el => {
        allCategoryStructure.push(StructureData[1].body[1][count])
        count++
    })
    count = 0
    StructureData[2].body[1].map(el => {
        allCategoryStructure.push(StructureData[2].body[1][count])
        count++
    })
    console.log(allCategoryStructure)

    let allDeleteData = []
    allCategoryStructure.map(category =>{
        if(typeof category.deleteData !== 'undefined' && category.deleteData !== 'none'){
            let flag = true
            allDeleteData.map(cat=>{
                if(cat.path === category.path){
                    flag = false
                }
            })
            if(flag){
                allDeleteData.push({path:category.path, deleteData:category.deleteData})
            }
        }
    })

    listDeleteData = allDeleteData


    const cardDbList = await CardModel1.findAll();
    CardData = cardDbList

    let cartSortCategory = []
    let allPath = []
    cardDbList.map(el => {
        el.category.map(elCat => {
            if (!allPath.includes(elCat)) {
                allPath.push(elCat)
            }
        })
    })

    allPath.map(path => {
        cartSortCategory.push({path: path, body: []})
    })


    count = 0
    cartSortCategory.map(cat => {
        cardDbList.map(el => {
            if (el.category.includes(cat.path)) {
                cartSortCategory[count].body.push(el)
            }
        })
        count++
    })


    count = 0
    cartSortCategory.map(el => {
        let array = el.body; //массив, можно использовать массив объектов
        let size = 20; //размер подмассива
        let subarray = []; //массив в который будет выведен результат.
        for (let i = 0; i < Math.ceil(array.length / size); i++) {
            subarray[i] = array.slice((i * size), (i * size) + size);
        }
        cartSortCategory[count].body = subarray;
        cartSortCategory[count].len = subarray.length;
        count += 1;
    })

    allCategoryListData = cartSortCategory

    let cartSortCategoryPrev = []
    cartSortCategory.map(cat => {
        cartSortCategoryPrev.push(...cat.body[0])
    })

    CardPreviewData = []

    cartSortCategoryPrev.map(card => {
        let flag = true
        CardPreviewData.map(card1 => {
            if (card.id === card1.id) {
                flag = false
            }
        })
        if (flag) {
            CardPreviewData.push(card)
        }
    })
}

start()

setInterval(() => {
    console.log(listDeleteData, Date.now())
    listDeleteData.map(cat=>{
        if(cat.deleteData <= Date.now()){
            console.log(cat.path)
        }
    })
}, 1000);




