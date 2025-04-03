import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type : String,
    required : true
  },
  email:{
    type : String,
    required : true,
    unique:true
  },
  password:{
    type : String,
    required : true
  },
  verifyOTP:{
    type : String,
    default:""
  },
  verifyOTP_expire:{
    type:Number,
    default:0
  },
  isAccountVerified:{
    type:Boolean,
    default:false
  },
  resetOTP:{
    type:String,
    default:""
  },
  resetOTP_expire:{
    type:Number,
    default:0
  }
})

export const User = mongoose.model("User" , userSchema)