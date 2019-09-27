const Sequelize     = require('sequelize');

require('dotenv').config()

const DB_NAME       = process.env.DB_NAME;
const DB_USER       = process.env.DB_USER;
const DB_PASSWORD   = process.env.DB_PASSWORD;
const DB_HOST       = process.env.DB_HOST;
const DB_DIALECT    = process.env.DB_DIALECT;



const sequelize     = new Sequelize(`${DB_NAME}`,`${DB_USER}`,`${DB_PASSWORD}`,{
    host : `${DB_HOST}`,
    dialect : `${DB_DIALECT}`,
    define : {
        freezeTableName : true
    },
    pool : {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000
    },
    logging: false

});

module.exports = sequelize;
