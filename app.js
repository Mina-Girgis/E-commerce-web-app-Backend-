// require
const express = require('express');
const mongoose = require('mongoose');

// view engine
const app = express();
app.set('view engine','ejs');
// mongo db
const dbURI = "mongodb+srv://mina:kmNPCmGAiShEzoN9@cluster0.vhadudf.mongodb.net/?retryWrites=true&w=majority"
mongoose.set("strictQuery", false);
mongoose.connect(dbURI).then((result)=>{app.listen(3001);}).catch((err)=>{console.log(err);});


// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.send("<h1>Hello worldd</h1>");
});