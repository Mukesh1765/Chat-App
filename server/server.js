import express from "express"
import cors from "cors"
import "dotenv/config"
import http from "http"
import { connectDB } from "./library/db.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import { Server } from "socket.io"
import cookieParser from "cookie-parser"

const app = express()
const server = http.createServer(app)

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173"
];

export const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    }
})

export const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("user connected:", userId)

    if (userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user disconnected:", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

app.use(cors())
app.use(express.json({limit: "4mb"}))
app.use(cookieParser())

app.use("/api/status", (req, res) => res.send("Server is live now...!"))
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

await connectDB();

const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== "production") {
    server.listen(port, () => {
        console.log("Server running on port", port)
    })
}

export default server