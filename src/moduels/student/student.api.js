const { allowedTo, protectedRoutes, protectedRoutesTeacher, protectedRoutesStudent } = require('../auth/auth.service')
const { adminRegisterStudent, loginStudent, getProfileStudent, getAllStudentsByAdmin, getSingleStudentByAdmin, updateStudentProfile, AdminUpdateStudent } = require('./student.service')

const app = require('express').Router()
app.route('/admin/register/').post(protectedRoutes,adminRegisterStudent)
app.route('/login').post(loginStudent)
app.route('/admin').get(protectedRoutes,getAllStudentsByAdmin)
app.route('/profile').get(protectedRoutesStudent,getProfileStudent)
app.route('/:studentId/admin').get(protectedRoutes,allowedTo('admin'),getSingleStudentByAdmin)
app.route('/:id/update').put(updateStudentProfile)
app.route('/:studentId/update/admin').put(protectedRoutes,AdminUpdateStudent)
module.exports = app