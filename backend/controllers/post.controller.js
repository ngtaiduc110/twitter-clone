import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { image } = req.body
        const userId = req.user._id.toString()

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (!text && !image) {
            return res.status(400).json({ error: "Please provide text or image" })
        }

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image)
            image = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            image,
        })

        await post.save()
        res.status(201).json(newPost)
    } catch (error) {
        console.log("Error in createPost: ", error.message)
        res.status(500).json({ error: error.message })

    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this post" })
        }
        if (post.image) {
            const publicId = post.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(publicId)
        }
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in deletePost: ", error.message)
        res.status(500).json({ error: error.message })
        
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id.toString()

        if(!text) {
            return res.status(400).json({ error: "Please provide text for the comment" })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        const comment = {
            user: userId,
            text,
        }
        post.comments.push(comment)
        await post.save()

        res.status(201).json({ post })
    } catch (error) {
        console.log("Error in commentOnPost: ", error.message)
        res.status(500).json({ error: error.message })
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.user._id
        const {id:postId} = req.params

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            res.status(200).json({ message: "Post unliked successfully" })
        } else {
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const notification = new Notification({
                user: post.user,
                to: post.user,
                type: "like",
            })
            await notification.save()
            res.status(200).json({ message: "Post liked successfully" })
        }
    } catch (error) {
        console.log("Error in likePost: ", error.message)
        res.status(500).json({ error: error.message })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        })
        
        if(posts.length === 0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getAllPosts: ", error.message)
        res.status(500).json({ error: error.message })
        
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const likedPosts = await Post.find({
            _id: { $in: user.likedPosts },
        }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })

        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error in getLikedPosts: ", error.message)
        res.status(500).json({ error: error.message })
        
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const followingUsers = user.following
        const feedPosts = await Post.find({user: {$in: followingUsers}}).sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        })
        res.status(200).json(feedPosts)
    } catch (error) {
        console.log("Error in getFollowingPosts: ", error.message)
        res.status(500).json({ error: error.message })
        
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        })
        res.status(200).json(posts)

    } catch (error) {
        console.log("Error in getUserPosts: ", error.message)
        res.status(500).json({ error: error.message })
        
    }
}