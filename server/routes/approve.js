const express = require('express');
const JobPost = require('../models/JobData');
const router = express.Router();

// Backend: jobs route for fetching only approved jobs
router.get('/', async (req, res) => {
    try {
      const approvedJobs = await JobPost.find({ approved: true}); // Assuming deleted jobs are marked as deleted:true
      res.status(200).json(approvedJobs);
    } catch (error) {
      console.error('Error fetching approved jobs:', error.message);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;