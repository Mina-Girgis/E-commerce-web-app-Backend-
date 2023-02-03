const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const cartSchema = new Schema(
    {
        notes :{
            type:String,
            required:true,
        },
        totalPrice :{
            type:Number,
            required:true,
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        products :[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    required:true,
                },
                productName:{
                    type:String,
                    required:true,
                },
                quantity:{
                    type:Number,
                    required:true,
                },
                totalPrice:{
                    type:Number,
                    required:true,
                },

            }
        ],
    },{timestamps:true},
); 


const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;

