const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected")
    } catch (error) {
        console.error("Database connection error", error)
        throw error
    }
}

module.exports = connectDb