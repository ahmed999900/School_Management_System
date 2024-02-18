const { protectedRoutes } = require('../auth/auth.service')
const { createAcademicYear, getAcademicYears, getSingleAcademicYears, deleteAcademicYear, updateAcademicYear } = require('./academicYear.service')

const app = require('express').Router()
app.route('/').post(protectedRoutes,createAcademicYear).get(getAcademicYears)
app.route('/:id').get(getSingleAcademicYears).delete(protectedRoutes,deleteAcademicYear).put(protectedRoutes,updateAcademicYear)
module.exports = app