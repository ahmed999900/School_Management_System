const classLevelModel = require('../../../databases/models/classLevel.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const adminModel = require('../../../databases/models/admin.model')

// @desc Create Class Level
// @route POST /api/v1/classLevels/
// @access Private
module.exports.createClassLevel = catchAsyncError(async (req, res, next) => {
    const { name, description} = req.body
    const classLevelExist = await classLevelModel.findOne({ name });
    if (classLevelExist) {
        return next(new AppError('class Level Already Exists', 409));
    }
    let classLevel = new classLevelModel({ name ,  description, createdBy:req.admin._id});
    await classLevel.save();
    // Push Class Level To Admin
    const admin = await adminModel.findById(req.admin._id)
    admin.classLevels.push(classLevel)
    await admin.save();
    res.status(200).json({ message: 'Class Level Created Succefully', classLevel })
})


// @desc Get All Class Level
// @route GET /api/v1/classLevels/
// @access Private
module.exports.getClassLevels = catchAsyncError(async (req, res, next) => {
    const classLevels = await classLevelModel.find({ });
    res.status(200).json({ message: 'Class Level Feteched Succefully', classLevels })
})


// @desc Get Single Class Level
// @route GET /api/v1/classLevels/:id
// @access Private
module.exports.getSingleClassLevel = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let ClassLevel = await classLevelModel.findById(id)
    if (!ClassLevel) {
        return next(new AppError(` Class Level Not Found`  , 404)) 
    }
    res.json({ message: 'Success', ClassLevel })
})


// @desc Update Class Level
// @route UPDATE /api/v1/classLevels/:id
// @access Private
module.exports.updateClassLevel = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let classLevel = await classLevelModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!classLevel) {
        return next(new AppError(`Class Level Not Found`  , 404)) 
    }
    res.json({ message: 'Updated Class Level Successfully', classLevel })
})


// @desc Delete Class Level
// @route DELETE /api/v1/classLevels/:id
// @access Private
module.exports.deleteClassLevel = catchAsyncError(async (req, res , next) => {
    const { id } = req.params
    let classLevel = await classLevelModel.findByIdAndDelete(id);
    if (!classLevel) {
        return next(new AppError(`Class Level Not Found`  , 404)) 
    }
    res.json({ message: 'Deleted Class Level', classLevel })
})