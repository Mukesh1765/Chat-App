import User from "../models/User.js"
import Message from "../models/Message.js"
import cloudinary from "../library/clodinary.js"
import { io, userSocketMap } from "../server.js"

export const getUserProfiles = async (req, res) => {
    try {
        const user = req.user._id
        const filteredUsers = await User.find({_id: { $ne: user } }).select("-password")

        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: req.user._id, isRead: false })
            unseenMessages[user._id] = messages.length
        })
        await Promise.all(promises)

        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id :selectedUserId } = req.params
        const my_id = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId: my_id, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: my_id}
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: my_id}, {isRead: true})
        res.json({success: true, messages})
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, {isRead: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl = null
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image)
            imageUrl = uploadImage.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage})
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}