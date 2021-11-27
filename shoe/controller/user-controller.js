const mongoose = require('mongoose')

const bcrypt = require('bcrypt')

const Product = require('../model/product')
const User = require('../model/user')
const Cart = require('../model/cart')
const Order = require('../model/order')
const flash = require('express-flash')

exports.getProduct = (req, res) => {
    Product.find().sort({'submittedDate': 'desc'}).then( (products) => {
        res.render('users/index',{
            title:'home',
            products : products,
            isAutheticated : req.isAuthenticated()
        })
    }

    )
}

exports.getShopItems = (req, res) =>{
    Product.find().sort({'submittedDate': 'desc'}).then( (products) => {
        res.render('users/shop',{
            title:'shop',
            products : products,
            isAutheticated : req.isAuthenticated()
        })
    }

    )
}

exports.getSignUp = (req,res,next)=>{
    res.render('./users/signup',{title:'signup'})
}

exports.postSignUp = (req,res,next)=>{
    
    User.findOne({email : req.body.email}).then( usr => {
        if(usr){
            req.flash('error', 'Email Already Taken.');
            return res.redirect('/signup');
        }
        
        bcrypt.hash(req.body.pass,10).then((hashedPassword)=>{
            
            user = new User({
              name : req.body.name,
              email : req.body.email,
              password : hashedPassword
            })
            user.save().then((r)=>{
                req.flash('success', 'Your Account have been created!')
                res.redirect('/login')
            })
          }).catch((err)=>{
            req.flash('error', 'Sorry something went wrong!')
            res.redirect('/signup')
          })
    })

    
}

exports.addToCart = (req,res,next) => {
    const productId = req.params.productId
    const userId = req.user.id

    Cart.find({ userId : userId, productId : productId})
    .then( item => {
        
        if(item.length){
            return res.redirect('/cart')//addOneMore
        }
        const newItem = new Cart({
            userId : mongoose.Types.ObjectId(userId),
            productId : productId,
            quantity : 1
        })
        newItem.save().then( result => {
            req.flash('success', 'Item added to cart successfully.')
            res.redirect('/cart')
        }).catch( err => {
            req.flash('error', 'Failed to add the item.')
            res.redirect('/cart')
        })
    }).catch( err => {
        console.log('an error occured')
    })

}

exports.getCartItems = (req,res,next) => {
    Cart.find({userId : req.user.id}).populate('productId').then( items => {
        res.render('./users/cart',{title : 'cart', items : items, totalPrice : 0})
    })
}

exports.removeCartItem = (req, res, next) => {
    const cartId = req.params.cartItemId
    // Cart.deleteOne(cartId).then()
    Cart.findById(cartId).then( item => {
        return item.remove()
    }).then( rslt => {
        req.flash('success','Item Successfully removed')
        res.redirect('/cart')
    }).catch( err => {
        throw err;
    })
}

exports.confirmOrder = (req, res, next) => {
    const orders = []

    Cart.find({userId : req.user.id}).populate('productId').then( items => {
        items.forEach( item => {
            orders.push(
                new Order({
                    userId : req.user.id,
                    productId : item.productId.id,
                    quantity : item.quantity,
                    paidPrice : item.productId.price
                })
            )
        })


        Cart.deleteMany({userId : req.user.id}).then( reslt => {
            Order.insertMany(orders).then(rslt => {
            
                req.flash('success','Your Order has been placed successfully');
                res.redirect('/orders')
            })
        })
        
    }).catch( err => {
        throw err;
    })
}

exports.getOrders = (req, res, next) => {
    Order.find({userId : req.user.id},null, {sort: {'_id': -1}})
    .populate('productId')
    .then(items => {
        res.render('./users/orders',{title : 'orders', items : items, totalPrice : 0})
    })
}

exports.cancelOrder = (req,res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId).then( item => {
        item.remove().then( rslt => {
            req.flash('success', 'The Item has been cancelled.')
            res.redirect('/orders')
        })
    })
}

exports.logout = (req,res, next) => {
    
  req.logOut()
  res.redirect('/login')
}
