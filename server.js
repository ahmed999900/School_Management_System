const express = require('express')
const { dbConnection } = require('./databases/dbConnection')
require('dotenv').config()
var morgan = require('morgan')
const AppError = require('./src/utils/AppError')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.static('uploads'))
app.use(morgan('dev'))
const cors = require('cors');
app.use(cors())
// *******************************************************************


app.use('/api/v1/auth', require('./src/moduels/auth/auth.api'))
app.use('/api/v1/admins', require('./src/moduels/admin/admin.api'))
app.use('/api/v1/academic-years', require('./src/moduels/academicYear/academicYear.api'))
app.use('/api/v1/academic-terms', require('./src/moduels/academicTerm/academicTerm.api'))
app.use('/api/v1/classLevels', require('./src/moduels/classLevel/classLevel.api'))
app.use('/api/v1/programs', require('./src/moduels/program/program.api'))
app.use('/api/v1/subjects', require('./src/moduels/subject/subject.api'))
app.use('/api/v1/yearGroups', require('./src/moduels/yearGroup/yearGroup.api'))
app.use('/api/v1/teachers', require('./src/moduels/teacher/teacher.api'))
app.use('/api/v1/exams', require('./src/moduels/exam/exam.api'))
app.use('/api/v1/students', require('./src/moduels/student/student.api'))
app.use('/api/v1/questions', require('./src/moduels/question/question.api'))



app.all('*', (req, res, next) => {
    // res.json({message:`Can't find this route : ${req.originalUrl}` })
    next(new AppError(`Can't find this route : ${req.originalUrl} on server`, 404))
})
// *******************************************************************

// ******************** global error handling middleware ************
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ Error: err.message, statusCode })
})
dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})