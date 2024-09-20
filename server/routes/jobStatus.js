const express = require("express");
const router = express.Router();
const JsData = require("../models/JsData"); // Import your JsData model
const { User } = require("../models/user");

// Route to fetch application status and jobCustomId based on email
router.get("/:email", async (req, res) => {
  const { email } = req.params; // Get the email from the route parameter

  try {
    // Log received email to verify the request
    console.log("Received email:", email);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch job application status and jobCustomId from JsData model based on user's email
    const statusData = await JsData.find(
      { email: user.email } // Match the email
    ).select("applicationStatus jobCustomId"); // Only select these fields

    // Check if any status data was found
    if (!statusData.length) {
      return res.status(404).json({ message: "No applications found" });
    }

    // Send the fetched data as response
    res.json(statusData);
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
