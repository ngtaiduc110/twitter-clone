import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, likePost, commentOnPost, deletePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js';

const postRoutes = express.Router();

postRoutes.get("/all", protectRoute, getAllPosts)
postRoutes.get("/following", protectRoute, getFollowingPosts)
postRoutes.get("/likes/:id", protectRoute, getLikedPosts)
postRoutes.get("/user/:username", protectRoute, getUserPosts)
postRoutes.post("/create", protectRoute, createPost)
postRoutes.post("/like/:id", protectRoute, likePost)
postRoutes.post("/comment/:id", protectRoute, commentOnPost)
postRoutes.delete("/:id", protectRoute, deletePost)

export default postRoutes
