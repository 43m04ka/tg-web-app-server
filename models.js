const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    basket: {type: DataTypes.JSON, defaultValue: {}},
})

const Data = sequelize.define('data', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

const CardData = sequelize.define('mainData', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    category: {type: DataTypes.STRING, defaultValue: ''},
    body: {type: DataTypes.JSON, defaultValue: {}},
})

module.exports = {Users, Data, CardData};