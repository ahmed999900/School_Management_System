const mongoose = require('mongoose')
const classLevelSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Student",
        }
    ],
    subjects: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Subject",
        }
    ],
    teachers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Teacher",
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('ClassLevel', classLevelSchema)