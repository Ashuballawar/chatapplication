const path=require('path')
const fs=require('fs');
 

let express=require('express');
const fileUpload=require('express-fileupload')
const bodyParser=require('body-parser')
const morgan=require('morgan');
const helmet=require('helmet');
const cron = require("node-cron");



const userrouter=require('./routes/userroute')
const grouprouter=require('./routes/grouproute')




const Sequelize=require('sequelize')
const sequelize=require('./data/database')
const User=require('./models/user')
const Message=require('./models/message')
const Group=require('./models/group')
const Usergroup=require('./models/usergroup')
const archive=require('./models/archive')


var cors = require('cors')

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});





const app=express();
app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE"],
    credentials:true,

}))



const server=require('http').createServer(app)
const io=require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }))



app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(morgan('combined',{stream:accessLogStream}))
//  app.use(helmet());



app.set('socketio', io);




User.hasMany(Message)
Message.belongsTo(User)
Group.hasMany(Message)
Message.belongsTo(Group)



Group.belongsToMany(User,{through:Usergroup})
User.belongsToMany(Group,{through:Usergroup})






app.use('/user',userrouter)
app.use('/group',grouprouter)
app.use((req,res)=>{
    console.log(req.url)
   
    res.sendFile(path.join(__dirname,`view/${req.url}`))
})

cron.schedule("21 3 * * *", async function() {
   
  try{
    let response=await sequelize.query("insert into archives select * from messages", { 
             
                           })
   
   let message=await Message.destroy({where:{}})
        
  }
  catch(err){
    console.log(err)
  }})

sequelize.sync().then(result=>{
  
     app.listen(process.env.PORT||3000)
   
}).catch(err=>{
    console.log(err)
})




server.listen(5000,()=>{
    console.log('server start')
})
