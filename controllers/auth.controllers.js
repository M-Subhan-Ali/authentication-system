export const register = async ( req , res ) => {
  
  const { name , email , password } = req.body;

  if( !name || !email  || !password){
    return res.status(400).json({
      message:"Please Fill the required fields"
    })
  }

  

}