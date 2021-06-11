const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        let decode = jwt.verify(token,process.env.JWT_SECRET)
            req.userDetails = decode
            next();
      
    }catch(err){
        res.json({Message:"Token authentication failed",err})
    }
};