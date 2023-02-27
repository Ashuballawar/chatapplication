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
router.get('/userlist/:id',getDataMiddleware,groupcontroller.userlist)
router.post('/makeadmin/:id',getDataMiddleware,groupcontroller.makeadmin)
router.delete('/delete/:id',getDataMiddleware,groupcontroller.delete)
router.get('/adduser/:id',getDataMiddleware,groupcontroller.adduser)
router.post('/addtogroup/:id',getDataMiddleware,groupcontroller.addtogroup)

module.exports=router;