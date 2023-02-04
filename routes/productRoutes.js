const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const path  = require('path');
const bodyParser = require("body-parser");



// models
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');


//upload images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      console.log(file);
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null,uniqueSuffix);
    }
  })
  const upload = multer({ storage: storage })


// Routers
router.post('/',upload.single('image'),async(req,res)=>{
    console.log(req.file);

    const product = new Product({
        name : req.body.name,
        image : req.file.path,
        description : req.body.description,
        price : req.body.price,
        category:  req.body.category,
        quantity:  req.body.quantity,
        sellerId : req.body.sellerId,
    });

    await product.save()
    .then(result=>{
        console.log('Product added');
    })
    .catch(err=>{
        console.log(err);
    });
    res.send("image uploaded & Product added");
});


router.get('/',async(req,res)=>{
    await Product.find({
        category:req.query.category,
        sellerId:req.query.sellerId,
    }).sort(req.query.sortBy).then(result=>{
        res.json(result);
    });
});


module.exports = router;