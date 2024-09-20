const express = require('express');
const JobPost = require('../models/JobData');
const router = express.Router();

// Update a job post
router.put('/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const updatedData = req.body;

    // Update the job post
    const result = await JobPost.findOneAndUpdate({ customId }, updatedData, {
      new: true,
      runValidators: true
    });

    // Check if a job post was found and updated
    if (!result) {
      return res.status(404).send({ message: 'Job post not found' });
    }

    // Respond with the updated job post
    res.status(200).send(result);
  } catch (error) {
    console.error('Error updating job post:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
