import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken" 

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
      return res.json({message:"User Already Exist!"})
    }
   
    const hashedPassword = await bcrypt.hash(password,11); 
     
    const user = new User({
      name,
      email,
      password:hashedPassword
    })

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
    
  } catch (error) {
    res.status(500).json({
      message:`Internal Server Error ${error}`
    })
  }



}