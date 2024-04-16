import mongoose from "mongoose";
const MongoConnect=async()=>{
    try {
        const response= await mongoose.connect(`${process.env.}`)
    } catch (error) {
        
    }
}