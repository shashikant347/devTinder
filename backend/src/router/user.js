const express = require('express')
const  userValidation  = require('../validations/user')
const userController = require('../controller/user')

const userRouter = express.Router()


userRouter.post('/signin',userValidation.signin,userController.signin)
userRouter.post('/login',userValidation.login,userController.login)

module.exports = userRouter;