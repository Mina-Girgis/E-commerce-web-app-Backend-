// require
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require("body-parser");
const { collection } = require('./models/user');

// view engine
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// mongo db

const dbURI = "mongodb+srv://mina:kmNPCmGAiShEzoN9@cluster0.vhadudf.mongodb.net/ECommerceApp?retryWrites=true&w=majority"
// const dbURI = "mongodb://localhost:27017/users"; 
mongoose.set("strictQuery", false);
mongoose.connect(dbURI).then((result)=>{app.listen(3000);}).catch((err)=>{console.log(err);});


// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json());


app.get('/',async(req,res)=>{
    await User.find().then(result=>{
        res.send(result);
    });
    
});

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










