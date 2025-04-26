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

// const allowedOrigin = [  "https://authentication-mern-app-gold.vercel.app"  ] 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://authentication-mern-app-gold.vercel.app',
  methods: ['GET', 'POST' , 'PUT', 'DELETE' , 'PATCH'],
  credentials: true 
}));
// app.use(cors({origin : allowedOrigin , credentials: true}))
// app.use(cors({origin : allowedOrigin , credentials: true}))
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigin.some(allowed => {
//       return origin === allowed || 
//              origin.endsWith(allowed.replace('https://', ''))
//     })) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   exposedHeaders: ['set-cookie'] // If using cookies
// }));


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
