const express = require("express");
const router = express.Router();
const { Admin } = require("./admin"); // Adjust path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Admin Registration
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

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).send({ message: "Admin already exists" });

        // Create new admin
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = new Admin({ email, password: hashedPassword });
        await admin.save();

        res.status(201).send({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate admin data
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });
        const { error } = schema.validate({ email, password });
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Check if admin exists
        const admin = await Admin.findOne({ email });
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
        res.status(200).send({ token, userType: "admin" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;
