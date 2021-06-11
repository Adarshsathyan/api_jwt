const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//imported the schema model
const User = require('../config/model');

//importing the jwt middleware
const verifyAuth = require('../config/middleware/check-auth')

const verifyLogin = (req,res,next)=>{
    if(req.session.userLoggedIn){
        next()
    }else{
        res.json({Message:"User not logged in"})
    }
}





//route for registering the user or the post request for the signup
router.post('/signup',async(req,res)=>{
    //hashong the raw password from client 
    let hashedPassword = await bcrypt.hash(req.body.password,10);

    const user = new User({
        name :req.body.name,
        email : req.body.email,
        password : hashedPassword //hashed password
    });

    try{
      //creating the user
        const registereduser = await user.save();
        res.json(registereduser)

    }catch(err){
        res.json(err)
    }
});

//for checking the login authentication
router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    try{
        
        if(user){
            //if there is email match comapring the hased password
            bcrypt.compare(req.body.password,user.password).then((status)=>{
                
                if(status){
                    let token = jwt.sign({
                        //payload
                        email:user.email,
                        userId:user._id
                    },
                    //secret or privatekey
                    process.env.JWT_SECRET,
                        //options
                        {
                            expiresIn:"1hr"
                        }
                    );
                    req.session.userLoggedIn=true
                    req.session.userDetails=user
                    res.json({Message:"Successfully logged In",token:token})

                }else{
                    res.json({message:"Invalid username or password"})
                }
            });
           
        }else{
            return res.json({Messgae:"No user found"});
        }
    }catch(err){
        res.json(err)
    }
});

//home route
router.get('/',verifyAuth,verifyLogin,(req,res)=>{
    try{
        let user ={
            name:req.session.userDetails.name,
            email:req.session.userDetails.email
        }
        res.json({Message:"Home",User:user})
    }catch(err){
        res.status(500).json("Server error")
    }
    
})

//logout route
router.get('/logout',verifyAuth,(req,res)=>{
    try{
       req.session.userLoggedIn=null//clearing or making the session null
        res.json("Logouted ")
    }catch(err){
        res.json(err)
    }
  
})

module.exports = router;