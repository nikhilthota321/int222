const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema =  new Schema({
    userId : {
        type : mongoose.Types.ObjectId,
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
    },
    paidPrice : {
        type : Number,
        min : 1
    }
})

module.exports = mongoose.model('order',orderSchema)