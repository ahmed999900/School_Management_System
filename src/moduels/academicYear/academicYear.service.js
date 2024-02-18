const academicYearModel = require('../../../databases/models/academicYear.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const adminModel = require('../../../databases/models/admin.model')

// @desc Create Academic Year
// @route POST /api/v1/academic-years/
// @access Private
module.exports.createAcademicYear = catchAsyncError(async (req, res, next) => {
    const { name, fromYear, toYear } = req.body
    const academicYearExist = await academicYearModel.findOne({ name });
    if (academicYearExist) {
        return next(new AppError('Academic Year Already Exists', 409));
    }
    let academicYear = new academicYearModel({ name , fromYear ,toYear , createdBy:req.admin._id});
    // let academicYear = await academicYearModel.insertMany({ name , fromYear ,toYear , createdBy:req.admin_id});
    await academicYear.save();
    // Push Academic Year To Admin
    const admin = await adminModel.findById(req.admin._id)
    admin.academicYears.push(academicYear)
    await admin.save();
    console.log(admin);
    res.status(200).json({ message: 'Academic Year Created Succefully', academicYear })
})


// @desc Get All Academic Year
// @route GET /api/v1/academic-years/
// @access Private
module.exports.getAcademicYears = catchAsyncError(async (req, res, next) => {
    const academicYears = await academicYearModel.find({ });
    res.status(200).json({ message: 'Academic Year Feteched Succefully', academicYears })
})


// @desc Get Single Academic Year
// @route GET /api/v1/academic-years/:id
// @access Private
module.exports.getSingleAcademicYears = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let academicYear = await academicYearModel.findById(id)
    if (!academicYear) {
        return next(new AppError(`Academic Year Not Found`  , 404)) 
    }
    res.json({ message: 'Success', academicYear })
})


// @desc Update Academic Year
// @route UPDATE /api/v1/academic-years/:id
// @access Private
module.exports.updateAcademicYear = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let academicYear = await academicYearModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!academicYear) {
        return next(new AppError(`Academic Year Not Found`  , 404)) 
    }
    res.json({ message: 'Updated Academic Year Successfully', academicYear })
})


// @desc Delete Academic Year
// @route DELETE /api/v1/academic-years/:id
// @access Private
module.exports.deleteAcademicYear = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let AcademicYear = await academicYearModel.findByIdAndDelete(id);
    if (!AcademicYear) {
        return next(new AppError(`Academic Year Not Found`  , 404)) 
    }
    res.json({ message: 'Deleted Academic Year', AcademicYear })
})