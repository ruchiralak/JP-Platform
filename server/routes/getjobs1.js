const express = require("express");
const JobData = require("../models/JobData");
const { User } = require("../models/user");
const router = express.Router();

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Log received email to ensure it's correctly passed
    console.log("Received email:", email);

    // Fetch the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    //console.log("Found user:", user);

    // Fetch jobs posted by this user (assuming email is stored in JobData)
    const jobs = await JobData.find({ email: user.email, approved: true }).exec();
    
    if (!jobs.length) {
      console.log("No jobs found for user:", user.email);
    }

    //console.log("Fetched jobs for user:", jobs);
    res.json(jobs);

  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
