const { protectedRoutes, protectedRoutesTeacher } = require('../auth/auth.service')
const { createExam, getExams, getSingleExam, deleteExam, updateExam } = require('./exam.service')

const app = require('express').Router()
app.route('/').post(protectedRoutesTeacher,createExam).get(getExams)
app.route('/:id').get(getSingleExam).delete(protectedRoutes,deleteExam).put(protectedRoutes,updateExam)
module.exports = app