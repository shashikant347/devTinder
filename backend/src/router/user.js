const express = require('express')
const  userValidation  = require('../validations/user')
const userController = require('../controller/user')
const {userAuth} = require('../middleware/auth')

const userRouter = express.Router()


userRouter.post('/signin',userValidation.signin,userController.signin)
userRouter.post('/login',userValidation.login,userController.login)
userRouter.get('/logout',userAuth,userController.logout)


userRouter.get('/me' ,userAuth,userController.getuser)
userRouter.patch('/update',userAuth,userController.updateProfile)

module.exports = userRouter;