const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    //text: { type: String, required: true },
    text: { type: String },
    fileUrl: { type: String }, // link from Cloudinary
    fileType: { type: String, enum: ["text", "image", "document"], default: "text" },
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("Message", messageSchema);
