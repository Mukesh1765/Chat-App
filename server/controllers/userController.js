import { generateToken } from "../library/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import cloudinary from "../library/clodinary.js"

export const signUp = async (req, res) => {
    const { name, email, password, bio } = req.body

    try {
        if (!name || !email || !password || !bio) {
            return res.json({success: false, message: "Missing Details"})
        }

        const user = await User.findOne({email})
        if (user) {
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name, email, password: hashedPassword, bio
        })

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account Created Successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await User.findOne({email})
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Incorrect password" })
        }

        const token = generateToken(userData._id)
        res.json({success: true, userData, token, message: "Login Successfully"})

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user})
}

export const updateProfile = async (req, res) => {
    try {
        const { bio, name } = req.body
        const userId = req.user._id

        const updateFields = {}

        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`

            const uploadRes = await cloudinary.uploader.upload(base64Image, {
                folder: "images",
            })
            updateFields.image = uploadRes.secure_url
        }

        if (bio) updateFields.bio = bio
        if (name) updateFields.name = name

        if (Object.keys(updateFields).length === 0) {
            return res.json({ noInputReceived: true })
        }

        const updatedData = await User.findByIdAndUpdate(userId, updateFields, {
            new: true,
        });

        return res.json({ success: true, user: updatedData })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}