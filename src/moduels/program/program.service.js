const programModel = require('../../../databases/models/program.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')

// @desc Create Program
// @route POST /api/v1/programs/
// @access Private
module.exports.createProgram = catchAsyncError(async (req, res, next) => {
    const { name, description, duration } = req.body
    const programExist = await programModel.findOne({ name });
    if (programExist) {
        return next(new AppError('Program Already Exists', 409));
    }
    let Program = new programModel({ name, description, duration, createdBy: req.admin._id });
    await Program.save();
    res.status(200).json({ message: 'Program Created Succefully', Program })
})


// @desc Get All Programs 
// @route GET /api/v1/programs/
// @access Private
module.exports.getPrograms= catchAsyncError(async (req, res, next) => {
    const Programs = await programModel.find({});
    res.status(200).json({ message: 'Programs Feteched Succefully', Programs })
})


// @desc Get Single Program
// @route GET /api/v1/programs/:id
// @access Private
module.exports.getSingleProgram = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Program = await programModel.findById(id)
    if (!Program) {
        return next(new AppError(` Program Not Found`, 404))
    }
    res.json({ message: 'Success', Program })
})


// @desc Update Program
// @route UPDATE /api/v1/programs/:id
// @access Private
module.exports.updateProgram = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Program = await programModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!Program) {
        return next(new AppError(`Program Not Found`, 404))
    }
    res.json({ message: 'Updated Program Successfully', Program })
})


// @desc Delete Program
// @route DELETE /api/v1/programs/:id
// @access Private
module.exports.deleteProgram = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Program = await programModel.findByIdAndDelete(id);
    if (!Program) {
        return next(new AppError(`Program Not Found`, 404))
    }
    res.json({ message: 'Deleted Program', Program })
})