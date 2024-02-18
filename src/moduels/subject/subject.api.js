const { protectedRoutes } = require('../auth/auth.service')
const { createSubject, getSubjects, deleteSubject, getSingleSubject, updateSubject } = require('./subject.service')

const app = require('express').Router()
app.route('/:programID').post(protectedRoutes, createSubject)
app.route('/').get(getSubjects)
app.route('/:id').get(getSingleSubject).delete(protectedRoutes, deleteSubject).put(protectedRoutes, updateSubject)
module.exports = app