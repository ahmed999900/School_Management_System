const adminModel = require('../../../databases/models/admin.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Register Admin
// @route POST /api/v1/admins/register
// @access Private
module.exports.register = catchAsyncError(async (req, res, next) => {
    const adminFound = await adminModel.findOne({ email: req.body.email });
    if (adminFound) {
        return next(new AppError('E-mail Already Exists', 409));
    }
    let Admin = new adminModel(req.body)
    await Admin.save();
    res.status(200).json({ message: 'Admin has been registered', Admin })
})

// @desc Login Admin
// @route POST /api/v1/admins/login
// @access Private
module.exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin) {
        const match = await bcrypt.compare(password, admin.password)
        if (match) {
            // *****************************************************
            // let token = generateToken({ name: user.name, role: user.role, userId: user._id })
            let token = jwt.sign({ name: admin.name, role: admin.role, email: admin.email, adminId: admin._id }, 'SKEY')
            // *****************************************************
            res.json({ message: "Success Signin", token })
        } else {
            res.json({ message: 'password in-correct' })
        }

    } else {
        res.status(409).json({ message: 'E-mail Not Registered' })
    }
})

// @desc get Admin Profile
// @route GET /api/v1/admins/:id
// @access Private
module.exports.getAdminProfile = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let Admin = await adminModel.findById(id).select('-password -createdAt -updatedAt -__v').populate('classLevels academicTerms')
    if (!Admin) {
        return next(new AppError(`Admin Not Found`, 404))
    }
    res.json({ message: 'Success', Admin })
})