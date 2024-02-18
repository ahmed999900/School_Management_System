const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const programSchema = mongoose.Schema({
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
        default: "4 years"
    },
    // Created Auto ====CSFTY
    code: {
        type: String,
        default: function () {
            return (
                this.name.split(" ").map(name => name[0]).join("").toUpperCase() + Math.floor(10 + Math.random() * 90) + Math.floor(10 + Math.random() * 90)
            )
        }
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
            default: []
        }
    ],
    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Student",
            default: []
        }
    ],
    subjects: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Subject",
            default: []
        }
    ],


}, { timestamps: true })

module.exports = mongoose.model('Program', programSchema)