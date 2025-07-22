import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("connected to database"))
        await mongoose.connect(`${process.env.MONGO_DB_URI}`)
    } catch (error) {
        console.log(error.message)
    }
}