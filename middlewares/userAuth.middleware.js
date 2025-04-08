const userAuth = async ( req , res , res ) => {

  const { token } = req.cookies
  
  if( !token ){
    return res.status(401).json({ message: "You must be logged in" })
  }

  

}