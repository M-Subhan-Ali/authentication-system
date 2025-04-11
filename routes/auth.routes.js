import { Router } from "express";
import { isAunthenticate, Login, Logout, register, resetPassword, sendResetOTP, sendVerifyOTP, verifyEmail } from "../controllers/auth.controllers.js";
import userAuth from "../middlewares/userAuth.middleware.js";

const route = Router();

route.post("/register" , register );

route.post("/login",Login );

route.post("/logout",Logout )

route.post("/send-verify-otp" , userAuth , sendVerifyOTP )

route.post("/verifyAccount" , userAuth , verifyEmail )

route.post("/is-auth" , userAuth , isAunthenticate )

route.post("/send-otp-reset-password" , sendResetOTP )

route.post( "/reset-password" , resetPassword)

export {route as userAuthRouter}