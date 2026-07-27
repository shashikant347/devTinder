
const express = require('express')
const requestController = require('../controller/request')
const { userAuth }= require('../middleware/auth')
const { model } = require('mongoose')


const requestRouter = express.Router()

requestRouter.post('/send/:status/:id', userAuth, requestController.sendConnectionRequest)
requestRouter.post('/sand/:status/:id', userAuth, requestController.sendConnectionRequest)
requestRouter.post('/review/:status/:id', userAuth, requestController.reviewRequest)

module.exports = requestRouter;