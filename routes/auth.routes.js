import { Router } from "express";
import { Login, Logout, register } from "../controllers/auth.controllers.js";

const route = Router();

route.post("/register" , register);

route.post("/login",Login);

route.post("/logout",Logout)

export {route as userRouter}