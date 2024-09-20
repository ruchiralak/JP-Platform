const express = require("express");
const router = express.Router();
const { admins } = require("../models/admins"); // Adjust path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Admin Login
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate admin data
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });
        const { error } = schema.validate({ email, password });
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Check if admin exists and retrieve firstName
        const admin = await admins.findOne({ email });
        if (!admin) return res.status(401).send({ message: "Invalid Email or Password" });

        // Compare password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        // Generate token
        const token = jwt.sign(
            { _id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send the response with the token, userType, and firstName
        res.status(200).send({ token, userType: "admin", firstName: admin.firstName });
    } catch (error) {
        console.error("Internal Server Error:", error.stack);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
