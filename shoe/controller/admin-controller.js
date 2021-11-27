const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2

const fs = require('fs')

const Product = require('../model/product')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

exports.getProduct = (req, res) => {
    Product.find().then( (products) => {
        

        res.render('admin/products',{
            title:'products',
            prods : products
        })
    }

    )
}

exports.getAddProduct = (req,res) => {
    res.render('admin/add-product', { 
        title : 'Add Product',
        productName : '',
        productPrice : '',
        featured : '',
        gender : '',
        errorMessage : '',
        notification : ''
    })
}
exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then( product => {
        if (!product) {
            return res.redirect('/');
        }
        
        res.render('admin/edit-product',{
            title:'Edit Product',
            product : product,
            errorMessage : '',
            notification : '',
            

        })


    })
}

exports.getCategories = (req,res) => {
    Product.find({featured : true})
        .then( products => {
            res.render('admin/categories',{
                title:'Categories',
                prods : products
            })
        })
    
}

exports.getOrders = (req,res) => {
    res.render('admin/orders',{title:'orders'})
}

exports.removeProduct = (req, res) => {

}

exports.postAddProduct = (req, res) => {
    const name = req.body.name
    const price = req.body.price
    const gender = req.body.gender
    const featured = req.body.featured !== undefined
    const newCollection = req.body.newCollection !== undefined
    const newPath = req.file.path + req.file.originalname
    if(!req.file || !price || !name){
        res.status(422).render('admin/add-product',{ 
            title : 'Add Product',
            productName : name,
            productPrice : price,
            featured : req.body.featured,
            newCollection : req.body.newCollection,
            gender : gender,
            errorMessage : 'Error! Invalid File inputs',
            notification : ''
        })
        return
    }
    fs.rename(req.file.path, newPath, (err) => {

        if (err)
            res.redirect('/admin/add') // Error Page
            cloudinary.uploader.upload(newPath,  {folder: "shoestore"},(error,result)=>{
                if (err)
                    res.redirect('/admin/add') // Error Page

                const imageUrl = result.url
                const product = new Product({
                    name : name,
                    price : price,
                    featured : featured,
                    newCollection : newCollection,
                    gender : gender,
                    imageUrl : imageUrl
                })

                product.save().then( r => {
                    res.status(201).render('admin/add-product',{ 
                        title : 'Add Product',
                        productName : '',
                        productPrice : '',
                        featured : '',
                        newCollection : '',
                        gender : '',
                        errorMessage : '',
                        notification : `The Product ${name} has been added sucessfully.`
                    })
                }).catch( err => {
                    res.redirect('/')
                })

                
                
            })
    })

}

exports.postEditProduct = (req,res)=>{
    if(!req.body.Price || !req.body.name){
        res.status(422).render('admin/edit-product',{ 
            title : 'Edit Product',
            product : {error : 'No Form Data'},
            errorMessage : 'Error! Invalid Forms inputs',
            notification : ''
        })
        return
    }

    Product.findById(req.body.productId)
        .then( product => {
            if(!product){
                res.status(422).render('admin/edit-product',{ 
                    title : 'Edit Product',
                    product : {error : 'Invalid Id!'},
                    errorMessage : 'Error! Unknown Product Id',
                    notification : ''
                })
                return
            }
            
            product.price = req.body.Price
            product.name = req.body.name
            product.featured = req.body.featured !== undefined
            product.newCollection = req.body.newCollection !== undefined
            product.gender = req.body.gender

            if(req.file){
                const newPath = req.file.path + req.file.originalname
                fs.rename(req.file.path, newPath, (err) => {

                    if (err)
                        res.redirect('/admin') // Error Page

                    cloudinary.uploader.upload(newPath, (error,result)=>{
                        if (err)
                            res.redirect('/admin') // Error Page
        
                        product.imageUrl = result.url

                        product.save()
                        res.redirect('/admin')
                    })
                })

                return
            }
            product.save()
            res.redirect('/admin')
            
            

        })
    
}

exports.removeProduct = (req,res) => {
    if (!req.query.delete) {
        return res.redirect('/admin'); //
    }
    Product.findById(req.params.productId)
        .then( product => {
            if (!product)
                res.redirect('/admin') // Error Page
            product.remove()
            res.redirect('/admin') // Flash Sucessfull deletion message
        })
        
}

exports.logout = (req,res, next) => {
    
    req.logOut()
    res.redirect('/admin/login')
}
