 const express = require('express')
 const userRouter = require('./router/user');
 const requestRouter = require('./router/request')
const appRouter = express.Router();


appRouter.use('/user',userRouter)
appRouter.use('/request',requestRouter)






module.exports = appRouter;
