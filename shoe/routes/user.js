const express = require('express')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const router = express.Router();

const userController = require('../controller/user-controller')
const auth = require('../util/auth')

router.get('/',userController.getProduct)

router.get('/login',auth.checkNotAuthenticated,(req,res,next)=>{
    res.render('./users/login',{ title:'login'})
})
router.post('/login',auth.checkNotAuthenticated,passport.authenticate('local',{
    //Just read the code as simple english
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
    //flash sets up messages variables
    //passport sets up an error msg inside messages
  }))


router.get('/signup',auth.checkNotAuthenticated,userController.getSignUp)

router.post('/signup',auth.checkNotAuthenticated,userController.postSignUp)

router.get('/logout',auth.checkAuthenticated,userController.logout)

router.get('/orders',auth.checkAuthenticated,userController.getOrders)
router.get('/cart',auth.checkAuthenticated,userController.getCartItems)
router.get('/shop', userController.getShopItems)

router.get('/add-to-cart/:productId',auth.checkAuthenticated, userController.addToCart)

router.get('/remove-cart-item/:cartItemId',auth.checkAuthenticated, userController.removeCartItem)

router.get('/confirm-order',auth.checkAuthenticated,userController.confirmOrder)

router.get('/cancel-order/:orderId',auth.checkAuthenticated, userController.cancelOrder)


module.exports = router