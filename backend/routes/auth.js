const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'7d',
    })
}
router.post("/register",async(req,res)=>{
    const{name,email,password}=req.body
    try{
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                message:"user already exists"
            });
        }
        const salt = await bcrypt.salt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        const user = await User.create({
            name,
            email,
            password:hashedpassword,
        })
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
        })
    }
    catch(error){
        res.status(401).json({
            message:'server error',error:error.message,
        })
    } 
})
router.post("/login", async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await user.findOne({email});
        if(!user){
            rea.status(400).json({
                message:"User not exists",
            });
        }
        const isMatch = await user.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                message:"invalid password or username",
            });
        }
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
        })
    }
    catch(error){
        res.status(401).json({
            message:"server error",
            error:error.message,
        })
    }
})

module.exports = router;