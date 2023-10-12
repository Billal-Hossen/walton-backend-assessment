require('dotenv').config()
import mongoose from "mongoose"

let connectionURL = process.env.DB_CONNECTION_URL
connectionURL = connectionURL.replace('<username>', process.env.DB_USER)
connectionURL = connectionURL.replace('<password>', process.env.DB_PASS)
export const connectDB = async () => {
    await mongoose.connect(connectionURL, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("=>>>> Database connection has been established successful")
}