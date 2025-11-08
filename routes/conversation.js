//import express from "express";
//import Conversation from "../models/conversation.js";
const express = require("express");
const Conversation = require("../models/conversation"); 
const router = express.Router();

// Create or get existing conversation between two users
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [senderId, receiverId] });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation", error: error.message });
  }
});

// Get all conversations of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.params.userId] },
    }).populate("participants", "username");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
});

export default router;
