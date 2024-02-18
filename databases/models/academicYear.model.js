const mongoose = require('mongoose')
const academicYearSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fromYear: {
        type: Date,
        required: true
    },
    toYear: {
        type: Date,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    teachers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Teacher",
        }
    ],
    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Student",
        }
    ],


}, { timestamps: true })

module.exports = mongoose.model('AcademicYear', academicYearSchema)

