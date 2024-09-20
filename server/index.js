require('dotenv').config(); // Load environment variables from a .env file into process.env

const express = require('express'); 
const app = express(); // Initialize the Express application
const cors = require("cors"); // Import CORS middleware to allow cross-origin requests
const connection = require("./db"); // Import the database connection function
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); 
const aregister = require('./routes/aRegister'); 
const alogin = require('./routes/aLogin'); 
const jseekerRoutes =require('./routes/jseeker');
const jobpostRoutes =require('./routes/jobposts')
const retrievejobRoutes=require('./routes/retrievejob')
const deletejobRoutes =require('./routes/deletejob');
const retrieveusersRoutes = require('./routes/retrieveUsers');
const deleteUserRoutes =require('./routes/deleteUsers');
const approveRoutes = require('./routes/approve');
const getjobRoutes =require('./routes/getjobs');
const getappliRoutes =require('./routes/getappli');
const getjobs1 = require('./routes/getjobs1');
const statusRoutes = require('./routes/status');
const jobstatusRoutes = require('./routes/jobStatus');
const updateRoute = require('./routes/updateJob')
// Database connection
connection(); 

// Middlewares
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cors()); // Middleware to enable CORS for handling cross-origin requests
app.use(express.urlencoded({extended:true}));


// Routes
app.use("/api/users", userRoutes); 
app.use("/api/auth", authRoutes); 
app.use("/api/aregister", aregister); 
app.use("/api/aLogin", alogin); 
app.use("/api/jseeker",jseekerRoutes);
app.use("/api/jp",jobpostRoutes);
app.use("/api/getjob",retrievejobRoutes);
app.use("/api/deljob",deletejobRoutes);
app.use("/api/getusers",retrieveusersRoutes);
app.use("/api/deluser",deleteUserRoutes);
app.use("/api/approve",approveRoutes);
app.use("/api/takejob",getjobRoutes);
app.use("/api/getappli",getappliRoutes);
app.use("/api/getjob1",getjobs1);
app.use('/api/status', statusRoutes);
app.use('/api/takejob1', jobstatusRoutes);
app.use('/api/update/',updateRoute);


// Server Initialization
const port = process.env.PORT || 8080; // Set the port number from environment variables or default to 8080
app.listen(port, () => console.log(`Listening on port ${port}...`)); // Start the server and log the listening port
