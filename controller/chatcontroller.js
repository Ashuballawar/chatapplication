const user=require('../models/user');
const message=require('../models/message')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

exports.sendchat=async (req,res,next)=>{
        
      try{
      
    let response=await req.user.createMessage({chat:req.body.chat,Name:req.user.Name})
    res.status(201).json(response)}
    catch(err){
        console.log(err)
    }
}

exports.getchat=async(req,res,next)=>{
    const { Op } = require("sequelize");
   console.log('=====>',req.query.datalength)
    namewithMessage=[]
      messageData= await message.findAll({where: {
         id:{[Op.gt]:req.query.datalength}}
      });
      if(messageData.length>0){
      messageData.forEach(element => {
        if(req.user.id===element.dataValues.userId){
            element.dataValues.Name='You'
       }
        namewithMessage.push({Name:element.dataValues.Name,chat:element.dataValues.chat,id:element.dataValues.id})
      });
      console.log(namewithMessage)
      return res.status(200).json( messageData)
    }

}
exports.previouschat=async(req,res,next)=>{
    const { Op } = require("sequelize");
    namewithMessage=[]
    messageData= await message.findAll({where: {
       id:{[Op.lt]:req.query.firstdata}}
    });
    if(messageData.length>0){
    messageData.forEach(element => {
      if(req.user.id===element.dataValues.userId){
          element.dataValues.Name='You'
     }
      namewithMessage.push({Name:element.dataValues.Name,chat:element.dataValues.chat,id:element.dataValues.id})
    });
    console.log(namewithMessage)
    return res.status(200).json( messageData)
  }



}