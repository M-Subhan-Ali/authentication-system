import { User } from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken" 
// import { sendWelcomeEmail } from "../ConfigDataBase/nodemailer.js";
import { transporter } from "../ConfigDataBase/nodemailer.js";




export const register = async ( req , res ) => {
  
  const { name , email , password } = req.body;

  if( !name || !email  || !password){
    return res.status(400).json({
      success:false,
      message:"Please Fill the required fields"
    })
  }

  try {

    const existingUser = await User.findOne({email})

    if(existingUser){
      return res.status(409).json({
        success:false,
        message:"User Already Exist!"})
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
    return res.status(401).json({
      success:false,
      message : "Please fill the required fields!"})
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
 
   if( user.isAccountVerified ){
     return res.json({
       success : false, //because the user is already verify why he again verify
       message : "User Already Verified!"})
   }
 
 
   const OTP = String( Math.floor( 100000 + Math.random() * 900000 ) );

   user.verifyOTP = OTP ;

   user.verifyOTP_expire = Date.now() + 24 * 60 * 60 * 1000;

   await user.save();
 
   const mailOptions = {
     from : `Your OTP for Mern Authentication ${process.env.EMAIL_USER}`,
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

export const verifyEmail = async ( req , res ) => {


  const { userID , otp } = req.body;

  if( !userID || !otp ){
    return res.status(400).json({message : "Missing Details!"})
  }

 try {
   const user = await User.findById(userID)
 
   if( !user ){
     return res.status(404).json({message : "User Not Found!"})
   }
 
   if( otp === "" || otp != user.verifyOTP ){
     return res.status(401).json({
       success: false ,
       message : "Invalid OTP!"})
   }
 
   if(user.verifyOTP_expire < Date.now()){
     return res.status(407).json({
       success : false , 
       message: "OTP Expired!"})
   }
 
   user.isAccountVerified = true;
   user.verifyOTP = "";   //set to default 
   user.verifyOTP_expire = 0;
   
   await user.save()
    
   return res.status(200).json({
     success : true ,
     message : "Email verified Successfull!"
   });
 } catch (error) {
  res.status(500).json({
    success : false ,
    message : `internal server error ${error}`
  })
 }

}


export const isAunthenticate = async ( req , res ) => {

  try {
    return res.json({success : true })
  } catch (error) {
    res.status(500).json({
      success : false ,
      message : error.message
    })
  }

}


export const sendResetOTP = async ( req , res ) => {

  const { email } = req.body ; 
 
  if( !email ){
    return res.status(400).json({message : "Email is required!"})
  }

  try {

    const user = await User.findOne( { email } );

    if( !user ){
      return res.status(404).
      json(
        {
          success : false ,
          message : "User not found!"
        }
      )
    }

    const OTP = String( Math.floor( 100000 + Math.random() * 900000 ) )

    user.resetOTP = OTP 

    user.resetOTP_expire = Date.now() + 15 * 60 * 1000

    await user.save()
    
    const mailOptions = {
      from : `Mern Authentication APP${process.env.EMAIL_USER}`,
      to : email,
      subject : "Reset OTP" ,
      text : `Your OTP for reset your passsword for your Mern Authentication App is ${OTP} `
    }

    await transporter.sendMail( mailOptions );

    return res.status(201).json({
      success : true ,
      message : "Reset Password OTP sent to your email!" ,
    })
    
  } catch (error) {
    res.status(500).json({
      success : false ,
      message : `internal server error ${error}`
    })
  }

}



export const resetPassword = async ( req , res ) => {

  const { email , otp , newPassword } = req.body ;

  if ( !email || !otp || !newPassword ){
    return res.status(400).json({message : "Email , OTP and New Password is required "})
  }

  try {

    const user = await User.findOne( { email } );

    if ( !user ){
      return res.status(404).json({message : "User not found "})
    }

    if( otp === "" || user.resetOTP !== otp ){
      return res.status(400).json({message : "Invalid OTP "})
    }

    if( user.resetOTP_expire < Date.now() ){
      return res.status(400).json({message : "OTP is expired "})
    }


    const hashedPassword = await bcrypt.hash( newPassword , 11 );

    user.password = hashedPassword ;
    
    user.resetOTP = "",

    user.resetOTP_expire = 0,
    
    
    await user.save();

    return res.status(200).json({
      success : true ,
      message : "Password Successfully Reset!✅"
    })

  } catch (error) {
    res.status(500).json({
      success : false ,
      message : `internal server error ${error}`
    })
  }

} 