const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name : {
        type : String,
        required : false,
        minlength : 3
    },
    imageUrl : {
        type : String
    },
    description : {
        type : String,
        default : 'Buy now, new Shoe'
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    quantity : {
        type : Number,
        default : 10,
        min : 0
    },
    featured : {
        type : Boolean,
        default : false
    },
    newCollection : {
        type : Boolean,
        default : false
    },   
    gender : {
        type : String,
        default : 'unisex'
    }
})

module.exports = mongoose.model('product',productSchema)