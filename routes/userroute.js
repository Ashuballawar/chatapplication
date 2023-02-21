let express=require('express');
let usercontroller=require('../controller/usercontroller')
const router=express.Router();
router.post('/signup',usercontroller.signup)
module.exports=router;