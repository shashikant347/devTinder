const express = require('express')
const dotenv = require('dotenv') ;
const appRouter  = require('./appRouter')
const connectDB = require('./config/connectDB')


dotenv.config();

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1',appRouter);




 async function    startServer (){
    try{
        await connectDB()
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        
        } )
    }catch(err){
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();