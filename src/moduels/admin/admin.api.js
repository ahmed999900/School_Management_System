const app = require('express').Router()
const { register, login, getAdminProfile } = require('./admin.service')
app.route('/register').post(register)
app.route('/login').post(login)
app.route('/:id').get(getAdminProfile)
module.exports = app