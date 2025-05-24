const Controls = require('./models/Controls');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async (req, res) => {
    try{
        const token = req.body.token ;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing !"
            })
        }
        //Verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            res.status(401).json({
                success:false,
                message:"Token is Invalid !"
            })
        }   
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Kuch to gadbad hai jee verification me !!"
        })
    }
}

exports.checkProjectCreationPermission = async (req, res) => {
    try{
        const ctrls = Controls.find({});
        if(!ctrls.createProject)
        {
            return res.status(401).json({
                success:false,
                message:"Please Contact Admin for permission !"
            })
        }
    }catch(error){
        console.log(error);
        return res.status(401).json({
        success:false,
        message:"Kuch to gadbad hai jee verification me !!"
    })}
    next();
}

exports.checkUserCreationPermission = async (req, res) => {
    try{
        const ctrls = Controls.find({});
        if(!ctrls.createUser)
        {
            return res.status(401).json({
                success:false,
                message:"Please Contact Admin for permission !"
            })
        }
    }catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Kuch to gadbad hai jee verification me !!"
        })
    }
    next();
}