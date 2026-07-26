
const express = require('express')
const requestController = require('../controller/request')
const { userAuth }= require('../middleware/auth')
const { model } = require('mongoose')


const requestRouter = express.Router()


requestRouter.get('/:status/:id',userAuth,requestController.sendConnectionRequest)


module.exports = requestRouter;