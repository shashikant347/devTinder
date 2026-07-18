const mongoose = require('mongoose')
const dotenv = require('dotenv')


dotenv.config();

const connectDB  = async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("database connect succesfully connected")
        
    }catch(err){
        console.log("database not connected: ",err)
        throw err

    }
}

module.exports  = connectDB;