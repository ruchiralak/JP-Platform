const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Define the admin schema
const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { 
        type: String, 
        required: true, 
        default: "admin" // Set default value to "admin"
    }
});

// Method to generate auth token
adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, userType: this.userType },
        process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your environment variables
        { expiresIn: "1h" } // Token validity of 1 hour
    );
    return token;
};

// Model the Admin schema
const admins = mongoose.model("admins", adminSchema);

// Function to validate admin registration
const validateAdmin = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        userType: Joi.string().valid("admin").optional().default("admin").label("User Type") // Include userType as optional
    });
    return schema.validate(data);
};


// Export the Admin model and validation function
module.exports = { admins, validateAdmin };
