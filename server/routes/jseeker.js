const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("../models/JsData"); // Ensure this path is correct

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define route for file upload
router.post("/", upload.single("file"), async (req, res) => {
  const { jobCustomId, username, email } = req.body; // Ensure these match the client-side keys
  const file = req.file;

  // Log incoming request data for debugging
  //console.log("Request Body:", req.body);
  //console.log("File Details:", req.file);
  // Check if all required data is present
  if (!file || !jobCustomId || !username || !email ) {
    console.error("Missing data:", {
      file: !!file,
      jobCustomId: !!jobCustomId,
      username: !!username,
      email: !!email,
      
    });
    return res
      .status(400)
      .send("File, jobCustomId, email, or username is missing.");
  }

  try {
    // Ensure req.file.buffer and req.file.originalname are not undefined
    if (!req.file.buffer || !req.file.originalname) {
      throw new Error("File data or file name is missing.");
    }

    // Create a new File instance with file data
    const newFile = new File({
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
      jobCustomId,
      username,
      email,
      
    });

    // Save the file to MongoDB
    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully!",
      file: {
        filename: newFile.fileName,
        id: newFile._id,
        jobCustomId: newFile.jobCustomId,
        username: newFile.username,
        email: newFile.email,
       
      },
    });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
