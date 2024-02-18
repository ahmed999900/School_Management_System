const { protectedRoutes } = require('../auth/auth.service')
const { createAcademicTerm, getAcademicTerms, deleteAcademicTerm, getSingleAcademicTerm, updateAcademicTerm } = require('./academicTerm.service')

const app = require('express').Router()
app.route('/').post(protectedRoutes,createAcademicTerm).get(getAcademicTerms)
app.route('/:id').get(getSingleAcademicTerm).delete(protectedRoutes,deleteAcademicTerm).put(protectedRoutes,updateAcademicTerm)
module.exports = app