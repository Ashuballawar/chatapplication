let express=require('express');
let usercontroller=require('../controller/usercontroller')
let chatcontroller=require('../controller/chatcontroller')
const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
router.post('/signup',usercontroller.signup)
router.post('/login',usercontroller.login)
router.get('/userlist',getDataMiddleware,usercontroller.userlist)
router.post('/sendchat',getDataMiddleware,chatcontroller.sendchat)
router.get('/getchat',getDataMiddleware,chatcontroller.getchat)
module.exports=router;