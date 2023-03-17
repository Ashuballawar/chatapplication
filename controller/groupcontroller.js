const user=require('../models/user');
const message=require('../models/message')
const group=require('../models/group')
const usergroup=require('../models/usergroup')


const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const AWS=require('aws-sdk')


const uploadtos3=require('../services/s3services')



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
   
    await newGroup.addUser(req.user.id,{through:{Admin:true}});
    console.log(req.body)
   
   Object.values(req.body.userlistwithid).forEach(async element => {
    await newGroup.addUser(element,{through:{Admin:false}})
    });
   
    res.status(201).json(newGroup)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:'something went wrong'})
    }

}


exports.getgroup=async (req,res,next)=>{
  try{
    let groups=await req.user.getGroups()
   res.status(200).json(groups)}
   catch(err){
    console.log(err)
    res.status(500).json({error:err})
   }
}





exports.getgroupinfo=async (req,res,next)=>{

  try{
    let groupinfo=await group.findAll({id:req.params.id})
    let message=await groupinfo[0].getMessages();
    console.log("====>",message)
    res.status(200).json(message)
}
catch(err){
  console.log(err)
  res.status(500).json({error:err})
}}




exports.sendchat=async (req,res,next)=>{
    try{
     
        let response=await req.user.createMessage({chat:req.body.chat,Name:req.user.Name,groupId:req.params.id})
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        // console.log('response=====>',response)
          let userlist=await groupinfo[0].getUsers()
          var io = req.app.get('socketio');
          io.sockets.on('connection',async(socket)=>{
             console.log('socketid======>',socket.id)
             socket.on('send-chat-message',data=>{
           
              userlist.forEach(element => {
                
             console.log(`send to ${element.dataValues.Name}`,data.chat,data.Name )
                socket.to(element.dataValues.socketId).emit('chat-message', { message:data.chat, name:data.Name,id:response.dataValues.id })
    
              })
             
             })
        
          
             
        })
        console.log('send jdjsjsjsjjjsjsjsjjjsjdjdjj')
        res.status(201).json(response)
      
     
      }
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
res.status(500).json({error:err})
}


    }





    exports.getchat=async(req,res,next)=>{
        const { Op } = require("sequelize");


        try{
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        let messageData=await groupinfo[0].getMessages({where: {
            id:{[Op.gt]:req.query.datalength}}
         });
    
         namewithMessage=[]
       console.log('=====>',req.query.datalength)
       
        
          if(messageData.length>0){
          messageData.forEach(element => {
            if(req.user.id===element.dataValues.userId){
                element.dataValues.Name='You'
           }
            namewithMessage.push({Name:element.dataValues.Name,chat:element.dataValues.chat,id:element.dataValues.id})
          });
          console.log("snsnsjjsj====>",namewithMessage)
          return res.status(201).json(namewithMessage)
        }
       
    }
    catch(err){
      console.log(err)
      res.status(500).json({error:err})
    }
  
  }




    exports.previouschat=async(req,res,next)=>{
        const { Op } = require("sequelize");
        try{
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
        catch(err){
          console.log(err)
      res.status(500).json({error:err})
        }
    
    
    }




    exports.userlist1=async (req,res,next)=>{

      try{
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        let groupMember=[]
        if(groupinfo[0]){
       let userlist=await groupinfo[0].getUsers()


         for(let i=0;i<userlist.length;i++){
          if(req.user.id===userlist[i].dataValues.id){
            userlist[i].dataValues.Name='You'
         }
         let Admin=await groupinfo[0].getUsers({through:{where:{Admin:true,userId:userlist[i].dataValues.id}}})   
        
         if(Admin[0]){
        
          groupMember.push({id:userlist[i].dataValues.id,Name:userlist[i].dataValues.Name,Admin:true})
         }
        else{ groupMember.push({id:userlist[i].dataValues.id,Name:userlist[i].dataValues.Name,Admin:false}) }
}
   
     
    }
   console.log("groupMember====>",groupMember) 
   res.status(200).json(groupMember)
 
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  }
 
  }



  exports.makeadmin=async (req,res,next)=>{
        console.log(req.body)
        try{
        let groupinfo=await group.findAll({where:{id:req.params.id}})
        let newadmin=await groupinfo[0].addUser(req.body.id,{through:{Admin:true}})
           res.status(201).json({msg:' successfully'})  
        // let response=await groupinfo[0].updateUser({where:{userId:req.body.id},through:{Admin:true}})
        }
        catch(err){
          console.log(err)
          res.status(500).json({error:err})
        }
  }




  exports.delete=async (req,res,next)=>{

    try{
    let groupinfo=await group.findAll({where:{id:req.params.id}})
console.log("req.query===>",parseInt(req.query.id)+2)
let userId=req.query.id
    let response=await groupinfo[0].removeUser(req.query.id)
          res.status(200).json({msg:'deleted'})   }
          catch(err){
            console.log(err)
            res.status(500).json({error:err})
          }

  }




  exports.adduser=async(req,res,next)=>{
    const { Op } = require("sequelize");
    try{
    let groupinfo=await group.findAll({where:{id:req.params.id}})
    let user1=await groupinfo[0].getUsers({through:{where:{Admin:true,userId:req.user.id}}})
    if(user1[0]){
      let groupuser=[];
      let notgroupuser=[]
      let adduser=await groupinfo[0].getUsers()
      adduser.forEach(element => {
        groupuser.push(element.dataValues.id)
        });

        let userwithinfo=await user.findAll({where:{id:{[Op.notIn]:groupuser}}})
      
      userwithinfo.forEach(element => {
        notgroupuser.push({id:element.dataValues.id,Name:element.dataValues.Name})
      });
      res.status(200).json(notgroupuser)
    }}
    catch(err){
      console.log(err)
      res.status(500).json({error:err})
    }
  }




  exports.addtogroup=async (req,res,next)=>{
    try{
    let groupinfo=await group.findAll({where:{id:req.params.id}})
   let response=await groupinfo[0].addUser(req.body.id,{through:{Admin:false}})
      res.status(201).json(response)
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  }
}




exports.upload=async (req,res)=>{
   try{
    
     let filename=`${req.params.id}_${new Date().getTime()}_${req.files.file.name}`
  

    let fileURL=await uploadtos3.uploadToS3(req.files.file.data,filename);
       console.log(fileURL)
     res.status(201).json(fileURL)
 
  }
  catch(err){
     console.log(err)
     res.status(500).json({err:err,success:false})
  }
  }
