const User = require('../models/User')
const jwt=require("jsonwebtoken");

//generate JWT token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"});
}

//register user
exports.registerUser=async(req,res)=>{
    const {fullName,email,password,profileImageUrl}=req.body;
    if(!fullName || !email ||!password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        //check if email already exists
        const existingUser=await User.findOne({email});
        console.log(existingUser)
        if(existingUser){
            return res.status(400).json({message:"Email already Exists"})        
        }

        //create the user 
        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        })

        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id)
        })
    }catch(err){
        res.status(500).json({message:"Error registering User",error:err.message})
    }
};

//login user
exports.loginUser=async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
      const user=await User.findOne({email});
      if(!user || !(await user.comparePassword(password))){
        return res.status(400).json({message:"Invalid Credentials"})
      }

      res.status(200).json({
        id:user._is,
        user,
        token:generateToken(user._id)
      });
    }catch(err){
        res.status(500).json({message:"Error login User",error:err.message})
    }
};


//registering user
exports.getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not Found"})
        }
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({message:"Error fetching User",error:err.message})
    }
};