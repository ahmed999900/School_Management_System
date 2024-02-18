const yearGroupModel = require('../../../databases/models/yearGroup.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const adminModel = require('../../../databases/models/admin.model')

// @desc Create Year Group
// @route POST /api/v1/yearGroups/
// @access Private
module.exports.createYearGroup = catchAsyncError(async (req, res, next) => {
    const { name, academicYear} = req.body
    const yearGroupExist = await yearGroupModel.findOne({ name });
    if (yearGroupExist) {
        return next(new AppError('Year Group Already Exists', 409));
    }
    let yearGroup = new yearGroupModel({ name ,  academicYear, createdBy:req.admin._id});
    await yearGroup.save();
    // Push year Group To Admin
    const admin = await adminModel.findById(req.admin._id)
    admin.yearGroups.push(yearGroup)
    await admin.save();
    res.status(200).json({ message: 'Year Group Created Succefully', yearGroup })
})


// @desc Get All Year Groups
// @route GET /api/v1/yearGroups/
// @access Private
module.exports.getYearGroups= catchAsyncError(async (req, res, next) => {
    const yearGroups = await yearGroupModel.find({ });
    res.status(200).json({ message: 'Year Group Feteched Succefully', yearGroups })
})


// @desc Get Single Year Group
// @route GET /api/v1/yearGroups/:id
// @access Private
module.exports.getSingleYearGroup= catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let YearGroup = await yearGroupModel.findById(id)
    if (!YearGroup) {
        return next(new AppError(`Year Group Not Found`  , 404)) 
    }
    res.json({ message: 'Success', YearGroup })
})


// @desc Update Year Group
// @route UPDATE /api/v1/yearGroups/:id
// @access Private
module.exports.updateYearGroup = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let YearGroup = await yearGroupModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!YearGroup) {
        return next(new AppError(`Year Group Not Found`  , 404)) 
    }
    res.json({ message: 'Updated Year Group Successfully', YearGroup })
})


// @desc Delete Year Group
// @route DELETE /api/v1/yearGroups/:id
// @access Private
module.exports.deleteYearGroup = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let YearGroup = await yearGroupModel.findByIdAndDelete(id);
    if (!YearGroup) {
        return next(new AppError(`Year Group Not Found`  , 404)) 
    }
    res.json({ message: 'Deleted Year Group', YearGroup })
})