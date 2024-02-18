const { protectedRoutes, protectedRoutesTeacher } = require('../auth/auth.service')
const { createQuestion, deleteQuestion, updateQuestion, getSingleQuestion, getQuestions } = require('./question.service')

const app = require('express').Router()
app.route('/:examId').post(protectedRoutesTeacher,createQuestion)
app.route('/').get(getQuestions)
app.route('/:id').get(getSingleQuestion).delete(protectedRoutes,deleteQuestion).put(protectedRoutes,updateQuestion)
module.exports = app