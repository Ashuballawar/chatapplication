const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    chat:{
        type:Sequelize.TEXT
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },

})

module.exports=message