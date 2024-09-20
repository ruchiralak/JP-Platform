//Job data store schema
const { required } = require("joi");
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    customId: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type:String,
        required:true
    },

    title: { 
        type: String, 
        required: true
        
    },
    companyName: {
        type:String,
        required: true
    },
    description: { 
        type: String, 
        required: true 
    },
    requirement: {
        type:String,
        required:true
    },
    salary: {
        type: String,
        required:true
    },
    location : {
        type:String,
        required:true
    },
    jobtype:{
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false // New posts are not approved by default
    },
    deleted: {
        type: Boolean,
        default: false // By default, jobs are not deleted
    }
   
});

//model the file Schema
const JobData = mongoose.model("JobData", fileSchema);

module.exports =  JobData;
