const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const productSchema = new Schema(
    {
        name :{
            type:String,
            required:true,
        },
        image :{
            type:String,
            required:true,
        },
        description :{
            type:String,
            required:true,
        },
        price :{
            type: Number,
            required:true,
        },
        category :{
            type:String,
            required:true,
        },
        quantity :{
            type:Number,
            required:true,
        },
    },{timestamps:true},
);


export const Product = mongoose.model('Product',productSchema);

/* 
id
name
image
description
price
category
quantity
created_by
created_at  
*/