const mongoose = require('mongoose')
const yearGroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    academicYear:{
        type: mongoose.Types.ObjectId,
        ref: "AcademicYear",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('YearGroup', yearGroupSchema)