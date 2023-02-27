const Sequelize=require('sequelize');
const sequelize=require('../data/database')
const usergroup=sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

Admin:{
    type:Sequelize.BOOLEAN
}
})
module.exports=usergroup