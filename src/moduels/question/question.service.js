const questionModel = require('../../../databases/models/question.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const examModel = require('../../../databases/models/exam.model')

// @desc Create Question
// @route POST /api/v1/questions/
// @access Private
module.exports.createQuestion = catchAsyncError(async (req, res, next) => {
    const { question,  optionA,  optionB,  optionC,  optionD, correctAnswer } = req.body
    const examExist = await examModel.findById(req.params.examId);
    if (!examExist) {
        return next(new AppError('Exam Not Exists', 409));
    }
    const QuestionExist = await questionModel.findOne({question});
    if (QuestionExist) {
        return next(new AppError('Question Already Exists', 409));
    }
    let Question = new questionModel({ question,optionA,  optionB,  optionC,  optionD, correctAnswer, createdBy: req.teacher._id });
    await Question.save();
    // Push Exam To Teacher
    examExist.questions.push(Question?._id)
    await examExist.save();
    res.status(200).json({ message: 'Question Created Succefully', Question })
})


// @desc Get All Questions
// @route GET /api/v1/questions/
// @access Private
module.exports.getQuestions = catchAsyncError(async (req, res, next) => {
    const Questions = await questionModel.find({});
    res.status(200).json({ message: 'Questions Feteched Succefully', Questions })
})


// @desc Get Single Questions
// @route GET /api/v1/questions/:id
// @access Private
module.exports.getSingleQuestion = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Question = await questionModel.findById(id)
    if (!Question) {
        return next(new AppError(`Question Not Found`, 404))
    }
    res.json({ message: 'Success', Question })
})


// @desc Update Question
// @route UPDATE /api/v1/questions/:id
// @access Private
module.exports.updateQuestion = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Question = await questionModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Question) {
        return next(new AppError(`Question Not Found`, 404))
    }
    res.json({ message: 'Updated Question Successfully', Question })
})


// @desc Delete Question
// @route DELETE /api/v1/questions/:id
// @access Private
module.exports.deleteQuestion = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Question = await questionModel.findByIdAndDelete(id);
    if (!Question) {
        return next(new AppError(`Question Not Found`, 404))
    }
    res.json({ message: 'Deleted Question', Question })
})