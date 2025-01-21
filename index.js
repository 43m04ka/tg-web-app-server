require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js')
const {mainData} = require("./models");
const {all} = require("express/lib/application");
const path = require("node:path");
const UserModel = require('./models.js').Users;
const DataModel = require('./models.js').Data;
const CardModel = require('./models.js').CardData;

const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();
let StructureData = {}
let CardData = []
let CardPreviewData = []
let allCategoryListData = []

const PORT = process.env.PORT || 8000;


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        const dataDb = await DataModel.findOne({id: 1})
        StructureData = dataDb.body.body
        const cardDbAll = await CardModel.findAll();
        CardData = cardDbAll

        let cartSortCategory = []
        cardDbAll.map(el => {
            flag = true
            cartSortCategory.map(cat => {
                if (cat.path === el.category) {
                    flag = false
                }
            })
            if (flag) {
                cartSortCategory = [...cartSortCategory, {path: el.category, body: []}]
            }
        })

        let count = 0
        cartSortCategory.map(cat => {
            cardDbAll.map(el => {
                if (cat.path === el.category) {
                    cartSortCategory[count].body = [...cartSortCategory[count].body, el]
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

        console.log(cartSortCategory)
        allCategoryListData = cartSortCategory
        let cartSortCategoryPrev = []
        count = 0
        cartSortCategory.map(cat => {
            cartSortCategoryPrev = [...cartSortCategoryPrev, ...cartSortCategory[count].body[0]]
            count++
        })

        CardPreviewData = cartSortCategoryPrev

        await app.listen(PORT, () => console.log('server started on PORT ' + PORT))
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
            const db = await UserModel.findOne({where: {chatId: String(chatId)}})
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
                    [{text: 'Магазин', web_app: {url: webAppURL + '/home0'}}]
                ]
            }
        })
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
            const chatId = String(user.id);
            const userDb = await UserModel.findOne({where: {chatId: chatId}});
            let isContinue = true;
            userDb.basket.body.map(el => {
                console.log(el.id, mainData.id, el.title, mainData.title)
                if (el.id === mainData.id && el.title === mainData.title) {
                    isContinue = false;
                    return res.status(200).json({body: true});
                }
            })
            if (isContinue) {
                userDb.basket = {body: [...[mainData], ...userDb.basket.body]};
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
            const userDb = await UserModel.findOne({where: {chatId: chatId}});
            return res.status(200).json(userDb.basket);
        } catch (e) {
            console.log(e)
            return res.status(502).json({});
        }
    } else if (method === 'del') {
        try {
            const {user, mainData} = req.body;
            const chatId = String(user.id);
            const userDb = await UserModel.findOne({where: {chatId: chatId}});
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
            const {user, accData, page} = req.body;
            console.log(req.body + '------')
            const chatId = String(user.id);
            const userDb = await UserModel.findOne({where: {chatId: chatId}});
            console.log(userDb)
            let userBasket = userDb.basket.body
            let resultMassage = ''
            if (page === 0) {
                resultMassage += 'Заказ Playstation\n\n'
            } else if (page === 1) {
                resultMassage += 'Заказ Xbox\n\n'
            } else if (page === 2) {
                resultMassage += 'Заказ Сервисы\n\n'
            }
            resultMassage += 'Контакт - @' + user.username + '\n\n'
            resultMassage += accData + '\n\n'
            resultMassage += 'Корзина:' + '\n\n'
            let sumPrice = 0
            let basketMsg = ''

            userBasket.map(pos => {
                let positionString = ''
                if (typeof pos.view === 'undefined') {
                    positionString += pos.title + ' '
                    if (typeof pos.platform !== 'undefined') {
                        positionString += pos.platform + ' '
                    }
                    positionString += '- ' + String(pos.price) + 'р'
                    if (typeof pos.url !== 'undefined') {
                        positionString += ' / ' + pos.url
                    }
                } else {
                    positionString += pos.title + ' ' + pos.view + ' - ' + String(pos.price) + 'р'
                }
                positionString += '\n'
                basketMsg += positionString
                sumPrice += pos.price
            })
            resultMassage += basketMsg
            resultMassage += '\n' + 'Итого к оплате:' + String(sumPrice) + 'р' + '\n'
            resultMassage += 'Статус: Не оплачен'

            if (basketMsg !== '') {
                console.log(basketMsg)
                bot.sendMessage(5106439090, resultMassage)

                userBasket.map(pos => {
                    let positionString = ''
                    if (typeof pos.view === 'undefined') {
                        positionString += pos.title + ' '
                        if (typeof pos.platform !== 'undefined') {
                            positionString += pos.platform + ' '
                        }
                        positionString += '- ' + String(pos.price) + 'р'
                        if (typeof pos.url !== 'undefined') {
                            positionString += ' / ' + pos.url
                        }
                    }
                })

                bot.sendMessage(chatId, 'Спасибо за Ваш заказ!\n' +

                    '\n' +
                    'Менеджер свяжется с Вами в ближайшее рабочее время для активации и оплаты заказа.\n' +
                    '\n' +
                    'Менеджер — @gwstore_admin. \n' +
                    'Часы работы 10:00 — 22:00 по МСК ежедневно.')
                userDb.basket = {body: []};
                userDb.save();
            }
            return res.status(200).json({body: true});
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
            data.map(async card => {
                await CardModel.create({body: card, category: card.tabCategoryPath, name: card.title});
            })
            return res.status(200).json({answer: true});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'getPreview') {
        try {
            // let array = Car;
            // let randomArray = []
            //
            // let count = 0
            // while(count<10) {
            //     let randomItem = array[Math.floor(Math.random() * array.length)];
            //     let add = true
            //     randomArray.map(el=>{
            //         if(el === randomItem){
            //             add = false
            //         }
            //     })
            //     if(add){
            //         randomArray= [...randomArray, randomItem]
            //         count++
            //     }
            // }
            //console.log(randomArray);
            return res.status(200).json({cards: CardPreviewData, structure: StructureData});
        } catch (e) {
            return res.status(550).json({});
        }
    } else if (method === 'delCategory') {
        const path = req.body.data;
        try {
            let request = []
            let len = 0
            allCategoryListData.map(cat => {
                if (cat.path === path) {
                    request = cat.body
                    len = cat.len
                }
            })
            console.log(request)
            request.map(async el => {
                await el.map(async el => {
                    await CardModel.destroy({
                        where: {
                            id: el.id
                        }
                    })
                })
            })
            return res.status(200).json({});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'updCategory') {
        const path = req.body.data;
        try {
            let request = []
            let len = 0
            allCategoryListData.map(cat => {
                if (cat.path === path) {
                    request = cat.body
                    len = cat.len
                }
            })

            let bool = false
            try {
                const cardDb = await CardModel.findByPk(request[0][0].id);
                bool = !cardDb.body.isSale
            } catch (e) {

            }
            request.map(async el => {
                el.map(async card => {
                    const cardDb = await CardModel.findByPk(card.id);
                    let newCard = cardDb.body;
                    newCard.isSale = bool;
                    cardDb.body = newCard;
                    await CardModel.update({body: newCard}, {
                        where: {
                            id: card.id
                        }
                    })
                })
            })
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
            return res.status(200).json({cards: CardPreviewData, structure: StructureData});
        } catch (e) {
            return res.status(550).json({});
        }
    } else if (method === 'getSearch') {
        try {
            const str = req.body.data.str;
            console.log(str)
            const page = req.body.data.page;


            let result = []
            CardData.map(card => {
                console.log(card)
                if (card.body.title.toLowerCase().includes(str.toLowerCase())) {
                    if(card.body.tab===page) {
                        result = [...result, card]
                    }
                }
            })

            return res.status(200).json({cards: result.slice(0, 25)});
        } catch (e) {
            console.log(e)
            return res.status(550).json({});
        }
    } else if (method === 'del') {
        try {
            await req.body.data.map(async el => {
                await CardModel.destroy({
                    where: {
                        id: el.id
                    }
                })
            })
            return res.status(200).json({});
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
    }
})


const reload = async () => {
    const dataDb = await DataModel.findOne({id: 1})
    StructureData = dataDb.body.body
    const cardDbAll = await CardModel.findAll();
    CardData = cardDbAll

    let cartSortCategory = []
    cardDbAll.map(el => {
        flag = true
        cartSortCategory.map(cat => {
            if (cat.path === el.category) {
                flag = false
            }
        })
        if (flag) {
            cartSortCategory = [...cartSortCategory, {path: el.category, body: []}]
        }
    })

    let count = 0
    cartSortCategory.map(cat => {
        cardDbAll.map(el => {
            if (cat.path === el.category) {
                cartSortCategory[count].body = [...cartSortCategory[count].body, el]
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
    count = 0
    cartSortCategory.map(cat => {
        cartSortCategoryPrev = [...cartSortCategoryPrev, ...cartSortCategory[count].body[0]]
        count++
    })

    CardPreviewData = cartSortCategoryPrev
}

start()




