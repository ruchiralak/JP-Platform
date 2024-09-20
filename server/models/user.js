const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true, enum: [ "employer", "jobSeeker"] }
});

// Method to generate auth token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email, userType: this.userType },
        process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your environment variables
        { expiresIn: "1h" } // Token validity of 1 hour
    );
    return token;
};

// Model the User schema
const User = mongoose.model("User", userSchema);

// Function to validate user registration
const validateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        userType: Joi.string().valid("employer", "jobSeeker").required().label("User Type")
    });
    return schema.validate(data);
};

// Export the User model and validation function
module.exports = { User, validateUser };
