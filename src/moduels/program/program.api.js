const { protectedRoutes } = require('../auth/auth.service')
const { getPrograms, createProgram, getSingleProgram, deleteProgram, updateProgram } = require('./program.service')

const app = require('express').Router()
app.route('/').post(protectedRoutes,createProgram).get(getPrograms)
app.route('/:id').get(getSingleProgram).delete(protectedRoutes,deleteProgram).put(protectedRoutes,updateProgram)
module.exports = app