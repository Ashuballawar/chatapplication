let express=require('express');
let groupcontroller=require('../controller/groupcontroller')

const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
router.post('/create',getDataMiddleware,groupcontroller.create)
router.get('/getgroup',getDataMiddleware,groupcontroller.getgroup)
router.get('/groupinfo/:id',getDataMiddleware,groupcontroller.getgroupinfo)
router.post('/sendchat/:id',getDataMiddleware,groupcontroller.sendchat)
router.get('/userlist/:id',getDataMiddleware,groupcontroller.userlist)
router.get('/getchat/:id',getDataMiddleware,groupcontroller.getchat)
router.get('/previouschat/:id',getDataMiddleware,groupcontroller.previouschat)
module.exports=router;