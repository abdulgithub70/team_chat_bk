const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx"],
  },
});

const upload = multer({ storage });

// File upload route
router.post("/", upload.single("file"), async (req, res) => {
    console.log("File upload request received", req.file);
  try {
    const fileUrl = req.file.path;
    const fileType = req.file.mimetype.includes("image") ? "image" : "document";

    res.status(200).json({ fileUrl, fileType });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

module.exports = router;
