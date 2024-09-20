const express = require("express");
const JobData = require("../models/JobData");
const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const jobs = await JobData.find({approved:true});
    res.status(200).json(jobs);

  } catch (error) {

    console.error("Error fetching approved jobs:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});
module.exports = router;
