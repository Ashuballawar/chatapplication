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
    namewithMessage=[]
      messageData= await message.findAll();
      
      messageData.forEach(element => {
        if(req.user.id===element.dataValues.userId){
            element.dataValues.Name='You'
       }
        namewithMessage.push({Name:element.dataValues.Name,chat:element.dataValues.chat})
      });
      console.log(namewithMessage)
      res.status(200).json(namewithMessage)
   
}