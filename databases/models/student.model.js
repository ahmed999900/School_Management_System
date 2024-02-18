const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateEmployed: {
        type: Date,
        default: Date.now
    },
    studentId: {
        type: String,
        required: true,
        default: function () {
            return (
                "TEA" + Math.floor(100 + Math.random() * 900) + Date.now().toString().slice(2, 4) + this.name.split(" ").map(name => name[0]).join("").toUpperCase()
            )
        }
    },
    role: {
        type: String,
        default: "student"
    },
    classLevels: [{
        type: mongoose.Types.ObjectId,
        ref: "ClassLevel",
    }],
    currentClassLevel: {
        type: mongoose.Types.ObjectId,
        default: function () {
            return this.classLevels[this.classLevels.length - 1]
        }
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    dateAdmitted: {
        type: Date,
        default: Date.now
    },
    academicYear: {
        type: mongoose.Types.ObjectId,
        ref: "AcademicYear",
    },
    examsResults: [
        {
            type: mongoose.Types.ObjectId,
            ref: "ExamResult",
        }
    ],
    program: {
        type: mongoose.Types.ObjectId,
        ref: "Program",
    },
    isPromotedToLevel200: {
        type: Boolean,
        default: false
    },
    isPromotedToLevel300: {
        type: Boolean,
        default: false
    },
    isPromotedToLevel400: {
        type: Boolean,
        default: false
    },
    isGraduated: {
        type: Boolean,
        default: false
    },
    isWitdrawn: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    perfectName: {
        type: String
    },
    financialReport: [
        {
            type: mongoose.Types.ObjectId,
            ref: "FinancialReport"
        }
    ],
    yearGraduated: {
        type: String
    },
}, { timestamps: true })


studentSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 6)
})
studentSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
studentSchema.pre('updateOne', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
// studentSchema.pre('save', function () {
//     // Ensure that this.password exists before trying to hash it
//     if (this.password) {
//         this.password = bcrypt.hashSync(this.password, 6);
//     }
// });
module.exports = mongoose.model('Student', studentSchema)