const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema =  new Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'user',
        required : true
    },
    productId : {
        type : mongoose.Types.ObjectId,
        ref : 'product',
        required : true
    },
    quantity : {
        type : Number,
        min : 1
    }
})

module.exports = mongoose.model('cart',cartSchema)