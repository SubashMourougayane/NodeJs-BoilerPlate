const Sequelize = require('sequelize');
const DB = require('../config/db');

const Users = DB.define('users',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    user_name : {
        type : Sequelize.STRING,
        allowNull : false,
        
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false,
    }
}) 

module.exports = Users;