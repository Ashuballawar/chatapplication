const user=require('../models/user');
const message=require('../models/message')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

exports.sendchat=async (req,res,next)=>{
       let chat=req.body.chat
    chat=await req.user.createMessage({chat:chat})
    res.status(201).json({chat})
}