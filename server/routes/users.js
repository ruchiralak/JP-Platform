const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body);  // Log the request body to ensure it's being received correctly

        // Validate the incoming request body
        const { error } = validateUser(req.body);
        if (error) {
            console.error("Validation Error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        // Check if a user with the provided email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            console.error("User Already Exists:", req.body.email);
            return res.status(409).send({ message: "User with given email already exists" });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

       
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            userType: req.body.userType || "job seeker" // Default userType to "job seeker" if not provided
        });
        await user.save();

        // Generate a JWT token
        const token = user.generateAuthToken();

        // Respond with the token
        res.status(201).send({ data: token, message: "User created successfully" });

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
