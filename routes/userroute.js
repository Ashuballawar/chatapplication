let express=require('express');
let usercontroller=require('../controller/usercontroller')
const router=express.Router();
router.post('/signup',usercontroller.signup)
router.post('/login',usercontroller.login)
module.exports=router;