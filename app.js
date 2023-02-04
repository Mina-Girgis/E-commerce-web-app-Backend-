// require
const express = require('express');
const mongoose = require('mongoose');


const { collection } = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');

  
// view engine
const app = express(); // form-data postman
app.set('view engine','ejs');


const dbURI = "mongodb+srv://mina:kmNPCmGAiShEzoN9@cluster0.vhadudf.mongodb.net/ECommerceApp?retryWrites=true&w=majority"
mongoose.set("strictQuery", false);
mongoose.connect(dbURI).then((result)=>{app.listen(3000);}).catch((err)=>{console.log(err);});


// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('products'));
app.use(express.json());


app.get('/',async(req,res)=>{
    await User.find().then(result=>{
        res.send(result);
    });
    
});


// userRoutes
app.use('/users',userRoutes);

// productRouter
app.use('/products',productRoutes);








