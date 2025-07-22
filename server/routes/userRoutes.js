import express from "express"
import { signUp, login, updateProfile, checkAuth } from "../controllers/userController.js"
import { protectRoute } from "../middlewares/auth.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.post("/signup", signUp)
userRouter.post("/login", login)
userRouter.patch("/update-profile", protectRoute, upload.single("image"), updateProfile)
userRouter.get("/check", protectRoute, checkAuth)

export default userRouter