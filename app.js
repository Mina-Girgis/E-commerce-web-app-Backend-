// require
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path  = require('path');
const bodyParser = require("body-parser");
const { collection } = require('./models/user');

// models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');



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

  

// view engine
const app = express(); // form-data postman
app.set('view engine','ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// mongo db

const dbURI = "mongodb+srv://mina:kmNPCmGAiShEzoN9@cluster0.vhadudf.mongodb.net/ECommerceApp?retryWrites=true&w=majority"
// const dbURI = "mongodb://localhost:27017/users"; 
mongoose.set("strictQuery", false);
mongoose.connect(dbURI).then((result)=>{app.listen(3000);}).catch((err)=>{console.log(err);});


// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('products'));
app.use(express.json());
// app.use(upload.single());

app.get('/',async(req,res)=>{
    await User.find().then(result=>{
        res.send(result);
    });
    
});


const createCart = async(userId)=>{

    const cart = new Cart({
        notes:" ",
        totalPrice:0,
        quantity:0,
        products:[],
        createdBy:userId,
    });
    await cart.save()
    .then(result=>{console.log("Cart added");})
    .catch(err=>{console.log(err);});

}; 



app.post('/users',async(req,res)=>{
 
    const user = new User(
        {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            phoneNumber : req.body.phoneNumber,
            accountType : req.body.accountType,   
        }
     );
     await user.save()
     .then(result=>{
         console.log("User Added");
         res.json(result);
         createCart(result._id);

     })
     .catch(err=>{
         console.log(err);
         res.send("Error");
     });
     
});


app.patch('/users/:userId',async(req, res) => {

    // remove( : ) from id
    const id = req.params.userId.slice(1);
    await User.findByIdAndUpdate(id, req.body)
    .then((result) => {
        if (!result) {
            console.log("Error");
            res.status(404).send("id not found");
        }
        res.send(req.body);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    })
})


app.delete('/users/:userId',async(req,res)=>{
    const id = req.params.userId.slice(1);
    await User.findByIdAndDelete(id)
    .then(result=>{
        console.log('user deleted');
        res.send('User Deleted');
    })
    .catch(err=>{
        console.log(err);
        res.status(400).send();
    });
});




app.post('/products',upload.single('image'),async(req,res)=>{
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


app.get('/products',async(req,res)=>{
    await Product.find({
        category:req.query.category,
        sellerId:req.query.sellerId,
    }).sort(req.query.sortBy).then(result=>{
        res.json(result);
    });
});





