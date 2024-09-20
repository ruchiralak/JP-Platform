const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const { nanoid } = require('nanoid');
const JobPost = require('../models/JobData');


// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Function to generate a unique custom ID
const generateCustomId = async () => {
    let customId;
    let isUnique = false;

    while (!isUnique) {
        customId = `Jb${nanoid(8)}`; // Adjust length as needed

        // Check if the generated ID already exists
        const existingJobPost = await JobPost.findOne({ customId });
        if (!existingJobPost) {
            isUnique = true;
        }
    }

    return customId;
};

 


// Route to create a new job post
router.post("/", async (req, res) => {
    try {
        const { title, description,companyName,requirement,salary,location,jobtype,email } = req.body;
       
        // Validate required fields
        if (!title ||!companyName || !description|| !requirement ||!salary ||!location ||!jobtype || !email) {

            return res.status(400).send('Title  description ,Requirements,salary,location,company Name and job type are required.');
        }
        const customId = await generateCustomId(); // Generate unique ID

        // Create a new job post with the generated custom ID
        const jobPost = new JobPost({
            customId,
            email,
            title,
            companyName,
            description,
            requirement,
            salary,
            location,
            jobtype
        });

        // Save the job post to the database
        await jobPost.save();

        // Respond with success message
        res.status(201).send("Job post published successfully");
    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
});



module.exports = router;
