const { protectedRoutes } = require('../auth/auth.service')
const { createClassLevel, getClassLevels, deleteClassLevel, getSingleClassLevel, updateClassLevel } = require('./classLevel.service')

const app = require('express').Router()
app.route('/').post(protectedRoutes,createClassLevel).get(getClassLevels)
app.route('/:id').get(getSingleClassLevel).delete(protectedRoutes,deleteClassLevel).put(protectedRoutes,updateClassLevel)
module.exports = app