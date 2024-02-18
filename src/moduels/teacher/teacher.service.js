const teacherModel = require('../../../databases/models/teacher.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const programModel = require('../../../databases/models/program.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Admin Register Teacher
// @route POST /api/v1/teachers/admin/register/
// @access Private
module.exports.adminRegisterTeacher = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const teacherFound = await teacherModel.findOne({ email });
    if (teacherFound) {
        return next(new AppError('Teacher Aleardy Employed', 409));
    }
    let Teacher = new teacherModel({ name, email, password, createdBy: req.admin._id });
    await Teacher.save();
    // // Push Teacher To Admin
    // programFound.subjects.push(Subject)
    // await programFound.save();
    res.status(200).json({ message: 'Teacher Registered Succefully', Teacher })
})


// @desc Login Teacher
// @route POST /api/v1/teachers/login
// @access Private
module.exports.loginTeacher = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const teacher = await teacherModel.findOne({ email });
    console.log(teacher.password);
    if (teacher) {
        const match = await bcrypt.compare(password, teacher.password)
        if (match) {
            // *****************************************************
            // let token = generateToken({ name: user.name, role: user.role, userId: user._id })
            let token = jwt.sign({ name: teacher.name, role: teacher.role, email: teacher.email, teacherId: teacher._id }, 'SKEY')
            // *****************************************************
            res.json({ message: "Teacher Logged In Successfully", token })
        } else {
            res.json({ message: 'password in-correct' })
        }

    } else {
        res.status(409).json({ message: 'E-mail Not Registered' })
    }
})



// @desc Get All Teachers  
// @route GET /api/v1/teachers/admin
// @access Private
module.exports.getAllTeachers = catchAsyncError(async (req, res, next) => {
    const Teachers = await teacherModel.find({});
    res.status(200).json({ message: 'Teachers  Feteched Succefully', Teachers })
})


// @desc Get Single Teacher
// @route GET /api/v1/teachers/:teacherId/admin
// @access Private
module.exports.getTeacherByAdmin = catchAsyncError(async (req, res, next) => {
    const { teacherId } = req.params
    let Teacher = await teacherModel.findById(teacherId)
    if (!Teacher) {
        return next(new AppError(` Teacher Not Found`, 404))
    }
    res.json({ message: 'Success', Teacher })
})


// @desc Update Subject
// @route UPDATE /api/v1/teachers/:id/update
// @access Private Teacher Only
module.exports.updateTeacherProfile = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Teacher = await teacherModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Teacher) {
        return next(new AppError(`Teacher Not Found`, 404))
    }
    res.json({ message: 'Updated Profile Successfully', Teacher })
})


// @desc Admin Update Teacher
// @route UPDATE /api/v1/teachers/:teacherID/update/admin
// @access Private Admin Only
module.exports.AdminUpdateTeacher = catchAsyncError(async (req, res, next) => {
    const { program, classLevel, academicYear, subject } = req.body
    let teacherFound = await teacherModel.findById(req.params.teacherID);
    if (!teacherFound) {
        return next(new AppError(`Teacher Not Found`, 404))
    }
    // check teacher is withdrawn or not
    if (teacherFound.isWitdrawn) {
        return next(new AppError(`Teacher Is IsWitdrawn`, 404))
    }
    // assign a program
    if (program) {
        teacherFound.program = program
        await teacherFound.save()
        res.json({ message: 'Updated Profile Successfully', teacherFound })
    }
    // assign a classLevel
    if (classLevel) {
        teacherFound.classLevel = classLevel
        await teacherFound.save()
        res.json({ message: 'Updated Profile Successfully', teacherFound })
    }
    // assign a academicYear
    if (academicYear) {
        teacherFound.academicYear = academicYear
        await teacherFound.save()
        res.json({ message: 'Updated Profile Successfully', teacherFound })
    }
    // assign a subject
    if (subject) {
        teacherFound.subject = subject
        await teacherFound.save()
        res.json({ message: 'Updated Profile Successfully', teacherFound })
    }

})


// @desc Get Profile teacher
// @route GET /api/v1/teachers/profile
// @access Private
module.exports.getTeacherProfile = catchAsyncError(async (req, res, next) => {
    let Teacher = await teacherModel.findById(req.teacher._id).select('-password -createdAt -updatedAt -__v')
    if (!Teacher) {
        return next(new AppError(`Teacher Not Found`, 404))
    }
    res.json({ message: 'Success', Teacher })
})