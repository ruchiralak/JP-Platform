const express = require('express');
const {User} = require('../models/user');
const router = express.Router();

router.delete('/:email', async (req, res) => { // Notice the route path here
    try {
        const { email } = req.params;

        // Delete the job post
        const result = await User.findOneAndDelete({ email });

        // Check if a job post was found and deleted
        if (!result) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Respond with a success message
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting User:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
