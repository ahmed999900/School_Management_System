const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const adminSchema = mongoose.Schema({
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
    role: {
        type: String,
        default: "admin"
    },
    classLevels: [
        {
            type: mongoose.Types.ObjectId,
            ref: "ClassLevel",
        }
    ],
    yearGroups: [
        {
            type: mongoose.Types.ObjectId,
            ref: "YearGroup",
        }
    ],
    academicYears: [
        {
            type: mongoose.Types.ObjectId,
            ref: "AcademicYear",
        }
    ],
    academicTerms: [
        {
            type: mongoose.Types.ObjectId,
            ref: "AcademicTerm",
        }
    ],
    teachers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Teacher",
        }
    ],
    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Student"
        }
    ]
}, { timestamps: true })
// **************************************Hash Password **************************
adminSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 7)
})
adminSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
adminSchema.pre('updateOne', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
//*******************************************************************************
module.exports = mongoose.model('Admin', adminSchema)