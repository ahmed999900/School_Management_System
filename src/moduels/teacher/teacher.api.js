const { allowedTo, protectedRoutes, protectedRoutesTeacher } = require('../auth/auth.service')
const { adminRegisterTeacher, loginTeacher, getAllTeachers, getTeacherByAdmin, getTeacherProfile, updateTeacherProfile, AdminUpdateTeacher } = require('./teacher.service')

const app = require('express').Router()
app.route('/admin/register/').post(protectedRoutes,adminRegisterTeacher)
app.route('/login').post(loginTeacher)
app.route('/admin').get(protectedRoutes,allowedTo('admin'),getAllTeachers)
app.route('/profile').get(protectedRoutesTeacher,getTeacherProfile)
app.route('/:teacherId/admin').get(protectedRoutes,allowedTo('admin'),getTeacherByAdmin)
app.route('/:id/update').put(updateTeacherProfile)
app.route('/:teacherID/update/admin').put(AdminUpdateTeacher)
module.exports = app