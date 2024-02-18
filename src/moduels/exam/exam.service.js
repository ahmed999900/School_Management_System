const examModel = require('../../../databases/models/exam.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const teacherModel = require('../../../databases/models/teacher.model')

// @desc Create Exam
// @route POST /api/v1/exams/
// @access Private
module.exports.createExam = catchAsyncError(async (req, res, next) => {
    const { name, description, classLevel, program, subject, academicTerm, duration, examTime, examType, academicYear } = req.body
    const TeacherFound = await teacherModel.findById(req.teacher._id);
    if (!TeacherFound) {
        return next(new AppError('Teacher Not Found', 409));
    }
    const examExist = await examModel.findOne({ name });
    if (examExist) {
        return next(new AppError('Exam Already Exists', 409));
    }
    let Exam = new examModel({ name, description, classLevel, program, subject, academicTerm, duration, examTime, examType, academicYear, createdBy: req.teacher._id });
    await Exam.save();
    console.log(req.teacher._id);
    // Push Exam To Teacher
    TeacherFound.examsCreated.push(Exam)
    await TeacherFound.save();
    res.status(200).json({ message: 'Exam Created Succefully', Exam })
})


// @desc Get All Exams
// @route GET /api/v1/exams/
// @access Private
module.exports.getExams = catchAsyncError(async (req, res, next) => {
    const Exams = await examModel.find({}).populate({
        path:'questions',
        populate:{
            path:'createdBy'
        }
    });
    res.status(200).json({ message: 'Exam Feteched Succefully', Exams })
})


// @desc Get Single Exam
// @route GET /api/v1/exams/:id
// @access Private
module.exports.getSingleExam = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Exam = await examModel.findById(id)
    if (!Exam) {
        return next(new AppError(`Exam Not Found`, 404))
    }
    res.json({ message: 'Success', Exam })
})


// @desc Update Exam
// @route UPDATE /api/v1/exams/:id
// @access Private
module.exports.updateExam = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Exam = await examModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Exam) {
        return next(new AppError(`Exam Not Found`, 404))
    }
    res.json({ message: 'Updated Exam Successfully', Exam })
})


// @desc Delete Exam
// @route DELETE /api/v1/exams/:id
// @access Private
module.exports.deleteExam = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Exam = await examModel.findByIdAndDelete(id);
    if (!Exam) {
        return next(new AppError(`Exam Not Found`, 404))
    }
    res.json({ message: 'Deleted Exam', Exam })
})