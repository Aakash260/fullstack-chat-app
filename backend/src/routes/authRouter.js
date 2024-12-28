import express from 'express';
import { login, logout, signup,updateProfile,checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
const authRouter = express.Router();

authRouter.post('/signup', signup);

authRouter.post('/login', login);
 
authRouter.post('/logout',logout);

authRouter.put("/update-profile",protectedRoute,updateProfile);

authRouter.get("/check", protectedRoute,checkAuth);

export default authRouter;