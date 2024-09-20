const express = require('express');
const JobPost = require('../models/JobData'); 
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch job posts from the database
        const jobPosts = await JobPost.find({ approved: false, deleted: { $ne: true } }); // Directly assign to a local variable

        // Respond with the job posts
        res.status(200).json(jobPosts);
    } catch (error) {
        console.error('Error retrieving job posts:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});
// Backend: Approve job route
router.patch('/:customId/approve', async (req, res) => {
    try {
        const job = await JobPost.findOneAndUpdate(
            { customId: req.params.customId },
            { $set: { approved: true } },  // Set approved to true
            { new: true }  // Return the updated document
        );

        if (!job) {
            return res.status(404).send({ message: 'Job not found' });
        }

        res.status(200).send(job);
    } catch (error) {
        console.error('Error approving job:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = router;
