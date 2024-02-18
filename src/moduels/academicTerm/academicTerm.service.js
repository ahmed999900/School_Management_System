const academicTermModel = require('../../../databases/models/academicTerm.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const adminModel = require('../../../databases/models/admin.model')

// @desc Create Academic Term
// @route POST /api/v1/academic-terms/
// @access Private
module.exports.createAcademicTerm = catchAsyncError(async (req, res, next) => {
    const { name, description, duration } = req.body
    const academicTermExist = await academicTermModel.findOne({ name });
    if (academicTermExist) {
        return next(new AppError('Academic Term Already Exists', 409));
    }
    let academicTerm = new academicTermModel({ name ,  description, duration , createdBy:req.admin._id});
    await academicTerm.save();
    // Push Academic Term To Admin
    const admin = await adminModel.findById(req.admin._id)
    admin.academicTerms.push(academicTerm)
    await admin.save();
    res.status(200).json({ message: 'Academic Term Created Succefully', academicTerm })
})


// @desc Get All Academic Term
// @route GET /api/v1/academic-terms/
// @access Private
module.exports.getAcademicTerms = catchAsyncError(async (req, res, next) => {
    const academicTerms = await academicTermModel.find({ });
    res.status(200).json({ message: 'Academic Term Feteched Succefully', academicTerms })
})


// @desc Get Single Academic Term
// @route GET /api/v1/academic-terms/:id
// @access Private
module.exports.getSingleAcademicTerm = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let academicTerm = await academicTermModel.findById(id)
    if (!academicTerm) {
        return next(new AppError(`Academic Term Not Found`  , 404)) 
    }
    res.json({ message: 'Success', academicTerm })
})


// @desc Update Academic Term
// @route UPDATE /api/v1/academic-terms/:id
// @access Private
module.exports.updateAcademicTerm = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let academicTerm = await academicTermModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!academicTerm) {
        return next(new AppError(`Academic Term Not Found`  , 404)) 
    }
    res.json({ message: 'Updated Academic Term Successfully', academicTerm })
})


// @desc Delete Academic Term
// @route DELETE /api/v1/academic-terms/:id
// @access Private
module.exports.deleteAcademicTerm = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let AcademicTerm = await academicTermModel.findByIdAndDelete(id);
    if (!AcademicTerm) {
        return next(new AppError(`Academic Term Not Found`  , 404)) 
    }
    res.json({ message: 'Deleted Academic Term', AcademicTerm })
})