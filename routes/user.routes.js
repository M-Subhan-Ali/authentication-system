import { Router } from "express";
import { getUserData } from "../controllers/user.controllers.js";
import userAuth from "../middlewares/userAuth.middleware.js";

const route = Router();

route.get("/data" , userAuth , getUserData)


export { route as userRouter}