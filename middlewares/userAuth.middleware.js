import  jwt  from "jsonwebtoken"

const userAuth = async ( req , res , next ) => {

  try {
    const { token } = req.cookies
    
    if( !token ){
      return res.json({success :false , message: "You must be logged in" })
    }
  
    const decodeToken = jwt.verify( token , process.env.SECRET )
  
    if( decodeToken.id ){
      
      req.body.userID = decodeToken.id
    
    }else{
    
      return res.status(401).json({ 
      success : false , 
      message: "You must be logged in" })
    
    }
  
    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error ${error}`
    })
  }

}

export default userAuth