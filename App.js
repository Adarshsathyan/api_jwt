const express = require('express');//imported express to project
const app = express();//intialize express
require('dotenv').config()//for the secret key
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
const session = require('express-session')




//middleware
app.use(bodyParser.json());
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized: true,cookie: { maxAge: 60000 }}))
app.use(express.urlencoded({extended:false}));
//using another folder for the routes
app.use('/', userRouter);



//db connection
mongoose.connect(process.env.URL,{useNewUrlParser: true, useUnifiedTopology: true},(ar)=>{
    console.log("Connected to database");
})


//connect to server
app.listen(process.env.PORT,()=>console.log(`Connected to port ${process.env.PORT}`));