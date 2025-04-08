import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken" 
// import { sendWelcomeEmail } from "../ConfigDataBase/nodemailer.js";
import { transporter } from "../ConfigDataBase/nodemailer.js";

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

    const mailOptions = {
      from:`Mern Authentication App ${process.env.EMAIL_USER}`,
      to: email,
      subject: "Welcome to Mern Authentication App",
      text: `Hello ${name} , Welcome to Mern Authentication App`
    }
    
    // await sendWelcomeEmail(name,email)

    await transporter.sendMail(mailOptions)

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

export const sendVerifyOTP = async ( req ,res ) => {
 
  //steps for my learning
  //get userid from frontend 
  //find user from db
  //check if its verify or not
  //if verify then show its verify
  //if not verify then  create otp and set expireotp and save it in user
  //otp send to the email
  

 try {
   const { userID } = req.body ;
 
   const user = await User.findById(userID);
 
   if( !user ){
     return res.status(404).json({message : "User Not Found!"})
   }
 
   if( user.verifyOTP ){
     return res.json({
       success : false, //because the user is already verify why he again verify
       message : "User Already Verified!"})
   }
 
 
   const OTP = String( Math.floor( 100000 + Math.random() * 900000 ) );

   user.verifyOTP_expire = Date.now() + 24 * 60 * 60 * 1000;

   await user.save();
 
   const mailOptions = {
     from : `OTP ${process.env.EMAIL_USER}`,
     to : user.email,
     subject : "Verify Your Account",
     html : `<h1>Your OTP is ${OTP} </h1>`,
   }
 
   await transporter.sendMail(mailOptions)
   
   return res.status(201).json({
     success : true , 
     message : "Verification OTP Send Successfully"
   })

 } catch (error) {
  res.status(500).json({
    success : false ,
    message : `internal server error ${error}`
  })
 }

}