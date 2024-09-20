const express = require("express");
const JsData = require("../models/JsData"); // Import the JsData model

const router = express.Router();

// Update Application Status Route
router.patch("/", async (req, res) => {
  const { email, applicationStatus, jobCustomId } = req.body;

  // Check for missing fields
  if (!email || !applicationStatus || !jobCustomId) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  try {
    console.log('Updating status for email:', email, 'and jobCustomId:', jobCustomId, 'to:', applicationStatus);

    // Find the applicant by email and jobCustomId
    const applicant = await JsData.findOneAndUpdate(
      { email, jobCustomId }, // Search by email and jobCustomId
      { $set: { applicationStatus } }, // Update the application status
      { new: true } // Return the updated document
    );

    // If no applicant is found, return 404
    if (!applicant) {
      console.log('Applicant not found for email:', email, 'and jobCustomId:', jobCustomId);
      return res.status(404).send({ message: 'Applicant not found' });
    }

    // If everything is okay, return the updated applicant
    res.status(200).send(applicant);
  } catch (error) {
    console.error('Error updating application status:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
