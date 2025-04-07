import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken" 
import sendWelcomeEmail from "../ConfigDataBase/nodemailer.js";

export const register = async ( req , res ) => {
  
  const { name , email , password } = req.body;

  if( !name || !email  || !password){
    return res.status(400).json({
      message:"Please Fill the required fields"
    })
  }

  try {

    const existingUser = await User.findOne({email})

    if(existingUser){
      return res.status(409).json({message:"User Already Exist!"})
    }
   
    const hashedPassword = await bcrypt.hash(password,11); 
     
    const user = new User({
      name,
      email,
      password:hashedPassword
    })

    await user.save()

    const token = jwt.sign({
      id:user._id
    },
    process.env.SECRET,{
    expiresIn:"9d"
    })

    res.cookie('token' , token , {
      httpOnly:true,
      secure : process.env.NODE_ENV === "production",
      sameSite :  process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge : 9 * 24 * 60 * 60 * 1000
    })
    
    await sendWelcomeEmail(email,name)

    return res.json({
      success : true,
      message:"SuccessFully Registered!"})
    
  } catch (error) {
    res.status(500).json({
      message:`Internal Server Error ${error}`
    })
  }

}


export const Login = async ( req , res ) => {

  const {  email , password } = req.body;

  if( !email || !password ){
    return res.status(401).json({message : "Please fill the required fields!"})
  }

  try {
    const existingUser = await User.findOne({email})
  
    if( !existingUser ){
      return res.json({
        success : false,
        message : "Invalid email! or user not exists!"})
    }
  
    const isMacthedPassword = await bcrypt.compare( password , existingUser.password);
  
    if( !isMacthedPassword ){
      return res.status(401)
      .json({
        success : false,
        message : "Incorrect Password!"})
    }
  
    const token = jwt.sign({
      id : existingUser._id
    },
     process.env.SECRET,
    {expiresIn : "9d"}
    )
    
    res.cookie('token' , token , {
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
      sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge : 9 * 24 * 60 * 60 * 1000
    })

    return res.json({
      success : true,
      message: "SuccessFully Login!"})
  
  } catch (error) {
   
    res.status(500).json({message : `Internal Server Error ${error}`})
    
  }

}


export const Logout = async ( req , res ) => {

  try {
    
    res.clearCookie("token",{
      httpOnly : true ,
      secure : process.env.NODE_ENV === "production",
      sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
    })

    return res.json({
    success  : true , 
    message : "Logged Out!"})

  } catch (error) {
    
    res.status(500).json({message : `Internal Server Error ${error}`})
    
  }
  
}