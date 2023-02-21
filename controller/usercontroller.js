const user=require('../models/user');
const bcrypt=require('bcryptjs')
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
                    res.status(403).json({error:'account already exist of this EmailId'})
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