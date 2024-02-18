const mongoose = require('mongoose')
const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: String,
        required: true,
        default: "3 months"
    },
    teachers:{
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
    },
    academicTerm:{
        type: mongoose.Types.ObjectId,
        ref: "AcademicTerm",
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Subject', subjectSchema)