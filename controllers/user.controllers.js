import { User } from "../models/user.models.js"

export const getUserData = async ( req , res ) => {
  
  const { userID } = req.body
  
  try {
    
    const user = await User.findById( userID );

    if( !user ){
      return res.status(404).json({ 
        success:false,
        message: "User not found" });
    }

    return res.status(201).json({
      success : true , 
      userData : {
        name : user.name,
        isAccountVerify : user.isAccountVerified
      }
    })

  } catch (error) {
    res.status(500).json({
      success : false ,
      message : `internal server error ${error}`
    })
  }

}