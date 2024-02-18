const subjectModel = require('../../../databases/models/subject.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const programModel = require('../../../databases/models/program.model')

// @desc Subjects
// @route POST /api/v1/subjects/
// @access Private
module.exports.createSubject = catchAsyncError(async (req, res, next) => {
    const { name, description, academicTerm } = req.body
    const programFound = await programModel.findById(req.params.programID);
    if (!programFound) {
        return next(new AppError('Program Not Found', 409));
    }
    const SubjectExist = await subjectModel.findOne({ name });
    if (SubjectExist) {
        return next(new AppError('Subject Already Exists', 409));
    }
    let Subject = new subjectModel({ name, description, academicTerm, createdBy: req.admin._id });
    await Subject.save();
    // Push Subject To Program
    programFound.subjects.push(Subject)
    await programFound.save();
    res.status(200).json({ message: 'Subject Created Succefully', Subject })
})


// @desc Get All Subjects 
// @route GET /api/v1/subjects/
// @access Private
module.exports.getSubjects = catchAsyncError(async (req, res, next) => {
    const Subjects = await subjectModel.find({});
    res.status(200).json({ message: 'Subjects Feteched Succefully', Subjects })
})


// @desc Get Single Subject
// @route GET /api/v1/subjects/:id
// @access Private
module.exports.getSingleSubject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Subject = await subjectModel.findById(id)
    if (!Subject) {
        return next(new AppError(` Subject Not Found`, 404))
    }
    res.json({ message: 'Success', Subject })
})


// @desc Update Subject
// @route UPDATE /api/v1/subjects/:id
// @access Private
module.exports.updateSubject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Subject = await subjectModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Subject) {
        return next(new AppError(`Subject Not Found`, 404))
    }
    res.json({ message: 'Updated Subject Successfully', Subject })
})


// @desc Delete Subject
// @route DELETE /api/v1/subjects/:id
// @access Private
module.exports.deleteSubject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Subject = await subjectModel.findByIdAndDelete(id);
    if (!Subject) {
        return next(new AppError(`Subject Not Found`, 404))
    }
    res.json({ message: 'Deleted Subject', Subject })
})