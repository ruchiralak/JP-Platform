const express = require('express');
const { User } = require('../models/user');  // Use the User model you defined
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch only firstName, email, and userType from the database
        const users = await User.find({}, 'firstName email userType lastName'); // Specify the fields to retrieve

        // Respond with the filtered user data
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
