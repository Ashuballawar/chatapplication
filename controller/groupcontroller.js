const user=require('../models/user');
const message=require('../models/message')
const group=require('../models/group')
const usergroup=require('../models/usergroup')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');



exports.create=async (req,res,next)=>{

    try{
          let groupexist=await group.findAll({where:{groupName:req.body.Name,createdBy:req.user.id}})
          console.log(req.body.Name)
          console.log("====>",Object.values(req.body.userlistwithid).length)
          
          if(groupexist[0]&&(Object.values(req.body.userlistwithid).length===1)){
            console.log("already exist===========>")
            return res.status(200).json(groupexist[0])
          }
    let newGroup=await group.create({groupName:req.body.Name,createdBy:req.user.id})
      
    await newGroup.addUser(req.user.id);
    console.log(req.body)
   
   Object.values(req.body.userlistwithid).forEach(async element => {
    await newGroup.addUser(element)
    });
   
    res.status(201).json(newGroup)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:'something went wrong'})
    }

}


exports.getgroup=async (req,res,next)=>{
    let groups=await req.user.getGroups()
   res.status(200).json(groups)
}
exports.getgroupinfo=async (req,res,next)=>{
    let groupinfo=await group.findAll({id:req.params.id})
    let message=await groupinfo[0].getMessages();
    console.log("====>",message)
    res.status(200).json(message)
}

exports.sendchat=async (req,res,next)=>{
    try{
      
        let response=await req.user.createMessage({chat:req.body.chat,Name:req.user.Name,groupId:req.params.id})
        res.status(201).json(response)}
        catch(err){
            console.log(err)
        }
    }

    exports.userlist=async (req,res,next)=>{
  try{let userid=[]
    let groupinfo=await group.findAll({where:{id:req.params.id}})
    let userlist=await groupinfo[0].getUsers()
    userlist.forEach(element => {
        if(req.user.id===element.dataValues.id){
            element.dataValues.Name='You'
       }
        userid.push({id:element.dataValues.id,Name:element.dataValues.Name})
    });
    res.status(200).json(userid)
     
  
  }
catch(err){
console.log(err)
}


    }



    exports.getchat=async(req,res,next)=>{
        const { Op } = require("sequelize");
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        let messageData=await groupinfo[0].getMessages({where: {
            id:{[Op.gt]:req.query.datalength}}
         });
    
   
       console.log('=====>',req.query.datalength)
        namewithMessage=[]
        
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
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        namewithMessage=[]
        let messageData=await groupinfo[0].getMessages({where: {
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
        return res.status(200).json(namewithMessage)
      }
    
    
    
    }