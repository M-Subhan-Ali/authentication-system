import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true}))

app.get("/hehe" , (req , res)=>{
  res.send("api working hehe subhan ali")
})

app.get("/subhan" , (req , res) => {
  res.send("subhan")
})
app.listen(port , ()=>{
  console.log(`server is running on ${port}`)
})
