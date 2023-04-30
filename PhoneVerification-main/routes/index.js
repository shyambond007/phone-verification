const express = require('express')
const route = express.Router();
const controllers = require('../controllers')

route.post("/sendOTP",controllers.sendOTP)
route.post("/verifyOTP",controllers.verifyOTP)

module.exports = route