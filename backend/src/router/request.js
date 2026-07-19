
const express = require('express')
const requestController = require('../controller/request')
const { userAuth }= require('../middleware/auth')


const requestRouter = express.Router()


requestRouter.get('/request/:status/:id',userAuth,requestController.sendConnectionRequest)


