 const express = require('express')
 const userRouter = require('./router/user');

const appRouter = express.Router();


appRouter.use('/user',userRouter)






module.exports = appRouter;
