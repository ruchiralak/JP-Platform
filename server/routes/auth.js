const router = require("express").Router();
const { User } = require("../models/user"); // Adjust the path to your User model
const joi = require("joi");
const bcrypt = require("bcrypt");

// Login route
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        
        // Send the response once
        res.status(200).send({ token, userType: user.userType, firstName: user.firstName, lastName: user.lastName , email:user.email });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Validate function
const validate = (data) => {
    const schema = joi.object({
        email: joi.string().email().required().label("Email"),
        password: joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
