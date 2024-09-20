const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  },
  jobCustomId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // New field to track the status of the job application
  applicationStatus: {
    type: String,
    enum: ["applied", "reviewed", "interviewed", "rejected", "hired"],
    default: "applied"
  },
  // Optional: You can also add notification status to track if the user has been notified about status changes
  
}, { timestamps: true }); // Add timestamps to track createdAt and updatedAt

// Model the file Schema
const JsData = mongoose.model("JsData", fileSchema);

module.exports = JsData;
