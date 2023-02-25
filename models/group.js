const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const group=sequelize.define('group',{

    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    createdBy:{
        type:Sequelize.INTEGER,
        allowNull:false,
    } 
   

    





})

module.exports=group