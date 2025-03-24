const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('userData', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    basket: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    favorites: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    freeGameId:{type: DataTypes.INTEGER},
})

const Data = sequelize.define('data', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const CardData = sequelize.define('card', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    category: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []},
    price: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    hashtag: {type: DataTypes.STRING, defaultValue: ''},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const Promo = sequelize.define('promo', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    body: {type: DataTypes.STRING, defaultValue: ''},
    parcent: {type: DataTypes.INTEGER, defaultValue: 0},
    number: {type: DataTypes.INTEGER, defaultValue: 0},
    numberLocal: {type: DataTypes.INTEGER, defaultValue: 0},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    summa: {type: DataTypes.INTEGER, defaultValue: 0},
    date: {type: DataTypes.STRING, defaultValue: ''},
    preview: {type: DataTypes.STRING, defaultValue: ''},
    status: {type: DataTypes.INTEGER, defaultValue: 0},
})

const OrderPosition = sequelize.define('orderPosition', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const FreeGameCards = sequelize.define('freeGameCards', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
})



User.hasMany(Order)
Order.hasMany(OrderPosition)

module.exports = {Data, Promo, Order, OrderPosition, CardData, User, FreeGameCards};