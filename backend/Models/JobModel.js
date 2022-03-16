const mongoose = require('mongoose')

const jobPostingSchema = new mongoose.Schema({
    recruiterEmail: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    positions: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    jobtype: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
})
const JobPosting = mongoose.model('jobposting', jobPostingSchema);
module.exports = JobPosting;