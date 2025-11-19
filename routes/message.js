const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ----------------------
// POST: Send a message
// ----------------------
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text, fileUrl, fileType } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId and receiverId required" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      fileUrl: fileUrl || "",
      fileType: fileType || "text",
    });

    const savedMessage = await newMessage.save();
    console.log("Message sent:", savedMessage); 
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------
// GET: Fetch messages between two users
// ----------------------
router.get("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "SenderId and ReceiverId required" });
    }

    // Fetch messages where sender and receiver match either way
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // oldest first

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
