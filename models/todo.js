const Sequelize = require('sequelize');
const DB = require('../config/db');

const Todo = DB.define('todo',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    user_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        
    },
    title : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    description : {
        type : Sequelize.STRING,
        allowNull : false,
    }
}) 


module.exports = Todo;