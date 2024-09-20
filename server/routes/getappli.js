const express = require('express');
const JsData = require("../models/JsData");
const JobData = require("../models/JobData");
const { User } = require("../models/user");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
      // Fetch all applicants
      const applicants = await JsData.find({});

      if (!applicants.length) {
          return res.status(404).json({ message: "No applicants found" });
      }

      res.status(200).json(applicants);
  } catch (error) {
      console.error("Error fetching applicants:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Route to download the actual PDF file by its ID
router.get('/download/:id', async (req, res) => {
    try {
        // Find the file document in MongoDB by its ID
        const file = await JsData.findById(req.params.id);

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Set the response headers to trigger a file download
        res.set({
            'Content-Type': file.contentType,            // Use the file's original content type (e.g., application/pdf)
            'Content-Disposition': `attachment; filename=${file.fileName}`  // Name the downloaded file
        });

        // Send the file data (binary buffer) to the client
        res.send(file.fileData);
    } catch (error) {
        console.error('Error retrieving file:', error.message);
        res.status(500).send('An error occurred while retrieving the file');
    }
});

module.exports = router;
