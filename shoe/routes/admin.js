const express = require('express')
const router = express.Router()

const multer = require('multer')
const passport = require('passport')

var upload = multer({ dest : './public/uploads' })

const adminController = require('../controller/admin-controller')
const auth = require('../util/auth')

router.get('/login',auth.checkNotAuthenticatedAdmin,(req,res,next)=>{
    res.render('admin/login',{title : 'login'})
})
router.post('/login',auth.checkNotAuthenticatedAdmin,passport.authenticate('local',{

    successRedirect : '/admin',
    failureRedirect : '/admin/login',
    failureFlash : true

}))
router.get('/add',auth.checkAuthenticatedAdmin,adminController.getAddProduct)
router.get('/remove/:productId',auth.checkAuthenticatedAdmin,adminController.removeProduct)
router.get('/edit/:productId',auth.checkAuthenticatedAdmin,adminController.getEditProduct)
router.get('/categories',auth.checkAuthenticatedAdmin,adminController.getCategories)
router.get('/orders',auth.checkAuthenticatedAdmin,adminController.getOrders)
router.post('/addproduct',auth.checkAuthenticatedAdmin,upload.single('productImage'),adminController.postAddProduct)
router.post('/edit',auth.checkAuthenticatedAdmin,upload.single('productImage'),adminController.postEditProduct)
router.get('/',auth.checkAuthenticatedAdmin,adminController.getProduct)

router.get('/logout',auth.checkAuthenticatedAdmin,adminController.logout)

module.exports = router