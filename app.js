let express=require('express');
const bodyParser=require('body-parser')
const sequelize=require('./data/database')
const User=require('./models/user')
const Message=require('./models/message')
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
const userrouter=require('./routes/userroute')
app.use('/user',userrouter)

sequelize.sync().then(result=>{
  
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
