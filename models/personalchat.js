const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const personalchat=sequelize.define('personalchat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    chat:{
        type:Sequelize.TEXT
    },
    sendBy:{
        type:Sequelize.INTEGER
    },
    sendTo:{
        type:Sequelize.INTEGER
    }
})

module.exports=personalchat