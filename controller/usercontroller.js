const user=require('../models/user');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

function isinvalid(a){
    if(a==undefined||a.length===0){
       return true;
    }
    return false;
 }

 exports.signup=async(req,res,next)=>{
    const Name=req.body.Name
        const Email=req.body.Email
        const Phonenumber=req.body.Phonenumber
        const Password=req.body.Password

        if(isinvalid(Name)||isinvalid(Email)||isinvalid(Password)){
            return res.status(400).json({err:' Something is missing'})
           }
         

        try{
            bcrypt.hash(Password,10,async(err,hash)=>{
                console.log(err)    
           try{
               data=await user.create({Name:Name,Email:Email,Phonenumber:Phonenumber,Password:hash})
               res.status(201).json(data)
            }
            catch(err){
                console.log(err.name)
                if(err.name=="SequelizeUniqueConstraintError"){
                    res.status(403).json({error:'account already exist of this EmailId or phonenumber'})
                }
                
                    else{
                        res.status(500).json({error:err})}
                
            }

           

        })
    }
        catch(err){
            res.status(500).json({error:err})
        }   

 }

 exports.login=async (req,res,next)=>{
    const { Op } = require("sequelize");
         const Email=req.body.Email;
         const Password=req.body.Password  
         if(isinvalid(Email)||isinvalid(Password)){
            return res.status(400).json({err:' Something is missing'})
           } 
           console.log('recieved request')
          let userdata=await user.findAll({where:{
            [Op.or]: [
                { Email:Email },
                { Phonenumber:Email }
              ]
         } })
         if(userdata[0]){
            bcrypt.compare(Password,userdata[0].Password,(err,result)=>{
                if(err){
                    throw new Error('Something went wrong')
                   }
                else if(result===true){
                      res.status(201).json({token:generateAccessToken(userdata[0].id,userdata[0].Name)} )
                }
                else{
                    res.status(401).json({msg:'Incorrect Password'})
                }



            })
         }
         else{
            res.status(404).json({msg:'Incorrect EmailId or phonenumber'})
         }

 }


 function generateAccessToken(Id,Name){
    return jwt.sign({userId:Id,Name:Name},process.env.JWT_SECRET)
 }
 


 exports.userlist=async(req,res,next)=>{
        listOfNname=[];
        list=await user.findAll({attributes:['Name','id']});
        list.forEach(element => {
            if(req.user.id===element.dataValues.id){
                element.dataValues.Name='You'
           }
           listOfNname.push({Name:element.dataValues.Name,id:element.dataValues.id})
        });
        
          res.status(200).json(listOfNname)
 }