const jwt=require('jsonwebtoken')
const User=require('../models/user')
require('dotenv').config()
const authenticate=async (req,res,next)=>{
    try{
        let token=req.header('Authorization')
        const Token=jwt.verify(token,process.env.JWT_SECRET)
        console.log(Token)
        let user =await User.findByPk(Token.userId)
        req.user=user;
        next();
    }
    catch(err){
        console.log(err)
    }}

    module.exports=authenticate