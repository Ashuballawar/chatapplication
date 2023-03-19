const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const archive=sequelize.define('archive',{

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
   
   userId:{
    type:Sequelize.INTEGER,
   },
   groupId:{
    type:Sequelize.INTEGER,
   },
   createdAt:{
    type:Sequelize.DATE
},
updatedAt:{
    type:Sequelize.DATE
},

    





})

module.exports=archive