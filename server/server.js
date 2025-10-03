import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./library/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  console.log("🔌 User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

// Routes
app.use("/api/status", (req, res) => res.send("✅ Server is live!"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// DB Connection
await connectDB();


const port = process.env.PORT || 1700;

if (process.env.NODE_ENV !== "production") {
    server.listen(port, () => {
    console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`)
    })
}
export default server; 
