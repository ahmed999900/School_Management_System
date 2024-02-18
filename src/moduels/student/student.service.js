const studentModel = require('../../../databases/models/student.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const programModel = require('../../../databases/models/program.model')
const { generateToken } = require('../../utils/generateToken')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Admin Register Student
// @route POST /api/v1/students/admin/register/
// @access Private
module.exports.adminRegisterStudent = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const StudentFound = await studentModel.findOne({ email });
    if (StudentFound) {
        return next(new AppError('Student Aleardy Employed', 409));
    }
    let Student = new studentModel({ name, email, password, createdBy: req.admin._id });
    await Student.save();
    // // Push Teacher To Admin
    // programFound.subjects.push(Subject)
    // await programFound.save();
    res.status(200).json({ message: 'Student Registered Succefully', Student })
})


// @desc Login Student
// @route POST /api/v1/students/login
// @access Private
module.exports.loginStudent = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const Student = await studentModel.findOne({ email });
    if (Student) {
        const match = await bcrypt.compare(password, Student.password)
        if (match) {
            // *****************************************************
            let token = generateToken({ name: Student.name, role: Student.role, email: Student.email, studentId: Student._id })
            // let token = jwt.sign({ name: Student.name, role: Student.role, email: Student.email, studentId: Student._id }, 'SKEY')
            // *****************************************************
            res.json({ message: "Student Logged In Successfully", token })
        } else {
            res.json({ message: 'password in-correct' })
        }

    } else {
        res.status(409).json({ message: 'E-mail Not Registered' })
    }
})


// @desc Get Profile Student
// @route GET /api/v1/students/profile
// @access Private
module.exports.getProfileStudent = catchAsyncError(async (req, res, next) => {
    let Student = await studentModel.findById(req.student._id).select('-password -createdAt -updatedAt -__v')
    if (!Student) {
        return next(new AppError(`Student Not Found`, 404))
    }
    res.json({ message: 'Success', Student })
})

// @desc Get All Students By Admin  
// @route GET /api/v1/students/admin
// @access Private
module.exports.getAllStudentsByAdmin = catchAsyncError(async (req, res, next) => {
    const Students = await studentModel.find({});
    res.status(200).json({ message: 'Students Feteched Succefully', Students })
})


// @desc Get Single Student By Admin
// @route GET /api/v1/students/:studentId/admin
// @access Private
module.exports.getSingleStudentByAdmin = catchAsyncError(async (req, res, next) => {
    const { studentId } = req.params
    let Student = await studentModel.findById(studentId)
    if (!Student) {
        return next(new AppError(`Student Not Found`, 404))
    }
    res.json({ message: 'Success', Student })
})


// @desc Update Student
// @route UPDATE /api/v1/students/:id/update
// @access Private Student Only
module.exports.updateStudentProfile = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Student = await studentModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Student) {
        return next(new AppError(`Student Not Found`, 404))
    }
    res.json({ message: 'Updated Profile Successfully', Student })
})


// @desc Admin Update Student
// @route UPDATE /api/v1/students/:studentId/update/admin
// @access Private Admin Only
module.exports.AdminUpdateStudent = catchAsyncError(async (req, res, next) => {
    const { program, classLevels, academicYear, name, email, perfectName } = req.body
    let studentFound = await studentModel.findById(req.params.studentId);
    if (!studentFound) {
        return next(new AppError(`Student Not Found`, 404))
    }
    let studentUpdate = await studentModel.findByIdAndUpdate(req.params.studentId, { $set: { program, academicYear, name, email, perfectName }, $addToSet: { classLevels } }, { new: true });
    res.status(200).json({ message: 'Updated Profile Successfully', studentUpdate })
})


