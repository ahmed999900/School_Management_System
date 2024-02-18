const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const teacherSchema = mongoose.Schema({
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
    teacherId: {
        type: String,
        required: true,
        default: function () {
            return (
                "TEA" + Math.floor(100 + Math.random() * 900) + Date.now().toString().slice(2, 4) + this.name.split(" ").map(name => name[0]).join("").toUpperCase()
            )
        }
    },
    isWitdrawn: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "teacher"
    },
    subject: {
        type: mongoose.Types.ObjectId,
            ref: "Subject"
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    program: {
        type: String
    },
    classLevel: {
        type: String
    },
    academicYear: {
        type: String
    },
    examsCreated: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Exam",
        }
    ],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        // required: true
    },
    academicTerm: {
        type:String
    },
}, { timestamps: true })
// **************************************Hash Password **************************
teacherSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 7)
})
teacherSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
teacherSchema.pre('updateOne', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 7)
})
module.exports = mongoose.model('Teacher', teacherSchema)