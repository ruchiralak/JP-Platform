const express = require("express");
const router = express.Router();
const { admins, validateAdmin } = require("../models/admins");
const bcrypt = require("bcrypt");

// Admin Registration
router.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body);  // Log the request body to ensure it's being received correctly

        // Validate the incoming request body
        const { error } = validateAdmin(req.body);
        if (error) {
            console.error("Validation Error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        // Check if an admin with the provided email already exists
        let admin = await admins.findOne({ email: req.body.email });
        if (admin) {
            console.error("Admin Already Exists:", req.body.email);
            return res.status(409).send({ message: "Admin with given email already exists" });
        }

        // Hash the password before saving the admin
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new admin with default userType as "admin"
        admin = new admins({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            userType: req.body.userType || "admin" // Default to "admin" if not provided
        });
        await admin.save();

        // Generate a JWT token
        const token = admin.generateAuthToken();

        // Respond with the token
        res.status(201).send({ data: token, message: "Admin created successfully" });

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
