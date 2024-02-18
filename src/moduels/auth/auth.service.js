const userModel = require('../../../databases/models/user.model')
const AppError = require('../../utils/AppError')
const { catchAsyncError } = require('../../middleware/catchAsyncError')
const ApiFeatuers = require('../../utils/ApiFeatuers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { myEmail } = require('../../utils/emails')
const adminModel = require('../../../databases/models/admin.model')
const teacherModel = require('../../../databases/models/teacher.model')
const studentModel = require('../../../databases/models/student.model')


module.exports.signup = async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) next(new AppError('E-mail Aleardy Exist', 409))
    let User = new userModel(req.body)
    await User.save();
    res.status(200).json({ message: 'Signup Success', User })
}

module.exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            // *****************************************************
            // let token = generateToken({ name: user.name, role: user.role, userId: user._id })
            let token = jwt.sign({ name: user.name, role: user.role, email: user.email, userId: user._id }, 'SKEY')
            // *****************************************************
            res.json({ message: "Success Signin", token })
        } else {
            res.json({ message: 'password in-correct' })
        }

    } else {
        res.status(409).json({ message: 'E-mail Not Registered' })
    }

}


module.exports.protectedRoutes = async (req, res, next) => {
    let { token } = req.headers;

    if (!token) return next(new AppError('Token Not Provided', 401))
    let decoded = await jwt.verify(token, 'SKEY');

    let admin = await adminModel.findById(decoded.adminId)
    if (!admin) return next(new AppError('In-valid Token', 401))

    if (admin.passwordChangedAt) {
        let changePasswordDate = parseInt(admin.passwordChangedAt.getTime() / 1000)
        if (changePasswordDate > decoded.iat) return next(new AppError('In-valid Token', 401))
    }
    req.admin = admin
    next()
}
module.exports.protectedRoutesTeacher = async (req, res, next) => {
    let { token } = req.headers;

    if (!token) return next(new AppError('Token Not Provided', 401))
    let decoded = await jwt.verify(token, 'SKEY');

    let teacher = await teacherModel.findById(decoded.teacherId)
    if (!teacher) return next(new AppError('In-valid Token', 401))

    if (teacher.passwordChangedAt) {
        let changePasswordDate = parseInt(teacher.passwordChangedAt.getTime() / 1000)
        if (changePasswordDate > decoded.iat) return next(new AppError('In-valid Token', 401))
    }
    req.teacher = teacher
    next()
}

module.exports.protectedRoutesStudent = async (req, res, next) => {
    let { token } = req.headers;

    if (!token) return next(new AppError('Token Not Provided', 401))
    let decoded = await jwt.verify(token, 'SKEY');

    let student = await studentModel.findById(decoded.studentId)
    if (!student) return next(new AppError('In-valid Token', 401))

    if (student.passwordChangedAt) {
        let changePasswordDate = parseInt(student.passwordChangedAt.getTime() / 1000)
        if (changePasswordDate > decoded.iat) return next(new AppError('In-valid Token', 401))
    }
    req.student = student
    next()
}


module.exports.allowedTo = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.admin.role))
            return next(new AppError('Your are not autherized this route , You are ' + req.admin.role, 401))
        next()
    })
}

exports.sendCode = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        res.status(401).json({ message: "E-mail Not Exist" })
    } else {
        const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.code = accessCode
        await user.save();
        myEmail(user.email, `<h1>access code : ${accessCode} </h1>`)
        res.json({ message: "Code Send Succefully" })
    }
});
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email, code, password } = req.body;
    if (!code) {
        res.status(401).json({ message: " Account dosn't require forget password yet" })
    } else {
        let user = await userModel.findOne({ email, code });
        if (!user) {
            res.status(401).json({ message: "In-correct E-mail Or Code" })
        } else {
            // const hashPassword = await bcrypt.hash(password, 8)
            await userModel.updateOne({ _id: user._id }, { code: code, password })
            let token = jwt.sign({
                name: user.name,
                userId: user._id
            }, process.env.JWT_KEY);
            res.json({ message: "Done", user, token })
        }
    }
});
