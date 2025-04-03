import mongoose from "mongoose";

const DBConnect = async () => {
  
  try {
    
    mongoose.connection.on("connected" , ()=>{
      console.log("Connected to MongoDB ✅")
    })
  
    mongoose.connection.on("error", (error)=>{
      console.error(`{Error connecting to MongoDB ${error} ❌}`)
      process.exit(1);
    })
    
    await mongoose.connect(`${process.env.MONGODB_URI}`)
  
  
  } catch (error) {
    
    console.error(`mongodb connection failed ${error}`)
    process.exit(1);

  }


}


export default DBConnect;