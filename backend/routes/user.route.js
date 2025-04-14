import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, followUnfollowUser, updateUserProfile, getSuggestedUsers } from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get("/profile/:username", protectRoute, getUserProfile)
userRoutes.get("/suggested", protectRoute, getSuggestedUsers)
userRoutes.post("/follow/:id", protectRoute, followUnfollowUser)
userRoutes.post("/update", protectRoute, updateUserProfile)

export default userRoutes