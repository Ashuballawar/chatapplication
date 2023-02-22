let express=require('express');
let usercontroller=require('../controller/usercontroller')
const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
router.post('/signup',usercontroller.signup)
router.post('/login',usercontroller.login)
router.get('/userlist',getDataMiddleware,usercontroller.userlist)
router.get('/sendchat',getDataMiddleware,)
module.exports=router;