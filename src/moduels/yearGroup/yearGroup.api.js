const { protectedRoutes } = require('../auth/auth.service')
const { createYearGroup, getYearGroups, deleteYearGroup, getSingleYearGroup, updateYearGroup } = require('./yearGroup.service')

const app = require('express').Router()
app.route('/').post(protectedRoutes,createYearGroup).get(getYearGroups)
app.route('/:id').get(getSingleYearGroup).delete(protectedRoutes,deleteYearGroup).put(protectedRoutes,updateYearGroup)
module.exports = app