const mongoose = require('mongoose')
const examSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    program: {
        type: mongoose.Types.ObjectId,
        ref: "Program",
        required: true
    },
    subject: {
        type: mongoose.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    passMark: {
        type: Number,
        required: true,
        default: 50
    },
    totalMark: {
        type: Number,
        required: true,
        default: 100
    },
    academicTerm: {
        type: mongoose.Types.ObjectId,
        ref: "AcademicTerm",
        required: true
    },
    duration: {
        type: String,
        required: true,
        default: "30 minutes"
    },
    examDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    examTime: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true,
        default: "Quiz"
    },
    examStatus: {
        type: String,
        required: true,
        enum: ['pending', 'live'],
        default: 'pending'
    },
    questions: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Question",
        }
    ],
    classLevel: {
        type: mongoose.Types.ObjectId,
        ref: "ClassLevel",
        required: true
    },

    academicYear: {
        type: mongoose.Types.ObjectId,
        ref: "AcademicYear",
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Exam', examSchema)