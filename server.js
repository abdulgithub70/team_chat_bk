const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const leaveRoutes = require("./routes/leave");
const attendanceRoutes = require("./routes/attendanceRoutes");
const uploadRoutes = require("./routes/upload");

const app = express();
const server = http.createServer(app); // ✅ create http server for socket

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/ip", async (req, res) => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();

    res.json({ ip: data.ip });
  } catch (err) {
    res.status(500).json({ ip: null, error: "Failed to fetch IP" });
  }
});


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // ✅ Socket.io setup
    const io = new Server(server, {
      cors: {
        origin: "*", // change to your frontend URL in production
        methods: ["GET", "POST"],
      },
    });

    let users = new Map();

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      socket.on("registerUser", (userId) => {
        users.set(userId, socket.id);
        console.log("Registered:", userId);
      });

      socket.on("sendMessage", (data) => {
        const { senderId, receiverId, text } = data;
        const receiverSocket = users.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", data);
        }
      });

      socket.on("disconnect", () => {
        for (let [userId, socketId] of users.entries()) {
          if (socketId === socket.id) {
            users.delete(userId);
            break;
          }
        }
        console.log("🔴 User disconnected:", socket.id);
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
