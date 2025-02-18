const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    basket: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
})

const Data = sequelize.define('data', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const CardData = sequelize.define('mainData', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    category: {type: DataTypes.STRING, defaultValue: ''},
    hashtag: {type: DataTypes.STRING, defaultValue: ''},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const CardData1 = sequelize.define('card', {
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

Users.hasMany(Order)
Order.hasMany(OrderPosition)

module.exports = {Users, Data, CardData, Promo, Order, OrderPosition, CardData1};