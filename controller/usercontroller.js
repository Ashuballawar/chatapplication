const user=require('../models/user');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


require('dotenv').config()
let express=require('express');


const app=express();
const server=require('http').createServer(app)
const io=require('socket.io')(server)


function isinvalid(a){
    if(a==undefined||a.length===0){
       return true;
    }
    return false;
 }



 exports.signup=(req,res,next)=>{
    const Name=req.body.Name
        const Email=req.body.Email
        const Phonenumber=req.body.Phonenumber
        const Password=req.body.Password

        if(isinvalid(Name)||isinvalid(Email)||isinvalid(Password)){
            return res.status(400).json({err:' Something is missing'})
           }
         

        try{
            bcrypt.hash(Password,10,async(err,hash)=>{
                if(err){console.log('errrr=>',err)   } 
           try{
           
           
           var io = req.app.get('socketio');
           
            io.sockets.on('connection',async (socket)=>{
            console.log('========>',socket.id)
             socket.on('hi',data=>{
                console.log(data)
             })
               data=await user.create({Name:Name,Email:Email,Phonenumber:Phonenumber,Password:hash,socketId:socket.id})
               res.status(201).json(data)
            }) }
            catch(err){
                console.log(err)
                if(err.name=="SequelizeUniqueConstraintError"){
                    res.status(403).json({error:'account already exist of this EmailId or phonenumber'})
                }
                
                    else{
                        res.status(500).json({error:err})}
                
            }

           

        })
    }
        catch(err){
            console.log(err)
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

           try{
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
        catch(err){
            console.log(err)
            res.status(500).json({error:err})
        }
 }


 function generateAccessToken(Id,Name){
    return jwt.sign({userId:Id,Name:Name},process.env.JWT_SECRET)
 }
 


 exports.userlist=async(req,res,next)=>{
        listOfNname=[];
        try{
        list=await user.findAll({attributes:['Name','id']});
        list.forEach(element => {
            if(req.user.id===element.dataValues.id){
                element.dataValues.Name='You'
           }
           listOfNname.push({Name:element.dataValues.Name,id:element.dataValues.id})
        });
        
          res.status(200).json(listOfNname)}
          catch(err){
            console.log(err)
            res.status(500).json({error:err})
          }
 }



 exports.updatesocketId=async(req,res,next)=>{
  
  try{
   
        
         let response=await user.update({socketId:req.body.socketId},{where:{id:req.user.id}})
         console.log("response=====>",response)
         if(response[0]===1){
           return res.status(201).json(response)}
           else{
            return res.status(500).json({msg:'something went wrong'})
           }
        }
  
    
    catch(err){
        console.log(err)
        res.status(500).json({msg:'something went wrong'})
    }
 }