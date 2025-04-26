import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config";
import DBConnect from "./ConfigDataBase/mongoDB.js";
import { userAuthRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 4000;

DBConnect();

const allowedOrigin = [ "http://localhost:5173" , "https://authentication-mern-app-gold.vercel.app" ] 

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigin , credentials: true}))

app.get("/hehe" , (req , res)=>{
  res.send("api working hehe subhan ali")
})

app.use("/api/auth", userAuthRouter)

app.use("/user", userRouter )


app.get("/subhan" , (req , res) => {
  res.send("subhan")
})
app.listen(port , ()=>{
  console.log(`server is running on ${port}`)
})
