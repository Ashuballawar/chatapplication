let express=require('express');
const bodyParser=require('body-parser')
const sequelize=require('./data/database')
const User=require('./models/user')
const Message=require('./models/message')
const Group=require('./models/group')
const Usergroup=require('./models/usergroup')
const Personalchat=require('./models/personalchat')
var cors = require('cors')

const app=express();
app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE"],
    credentials:true,

}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
User.hasMany(Message)
Message.belongsTo(User)
Group.hasMany(Message)
Message.belongsTo(Group)
User.hasMany(Personalchat)
Personalchat.belongsTo(User)
Group.belongsToMany(User,{through:Usergroup})
User.belongsToMany(Group,{through:Usergroup})
const userrouter=require('./routes/userroute')
const grouprouter=require('./routes/grouproute')
app.use('/user',userrouter)
app.use('/group',grouprouter)
sequelize.sync().then(result=>{
  
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
