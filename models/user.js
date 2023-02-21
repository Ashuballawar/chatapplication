const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const user=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    Phonenumber:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique: true
    },
    Password:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports=user