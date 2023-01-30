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
        products :[
            {
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


export const Cart = mongoose.model('Cart',cartSchema);


/*
id
notes
totalPrice
[ { productName, quantity, totalPrice } ]
created_by
created_at
*/