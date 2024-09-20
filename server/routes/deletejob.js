const express = require('express');
const JobPost = require('../models/JobData');
const router = express.Router();

router.delete('/:customId', async (req, res) => { // Notice the route path here
    try {
        const { customId } = req.params;

        // Delete the job post
        const result = await JobPost.findOneAndDelete({ customId });

        // Check if a job post was found and deleted
        if (!result) {
            return res.status(404).send({ message: 'Job post not found' });
        }

        // Respond with a success message
        res.status(200).send({ message: 'Job post deleted successfully' });
    } catch (error) {
        console.error('Error deleting job post:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
