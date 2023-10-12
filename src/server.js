import cors from 'cors'
import express from 'express'
import http from 'http'
require('dotenv').config()


import { connectDB } from "src/utils/database"
import routers from "src/routers";

// express application
const app = express()


app.use(cors())
app.use(express.json())

app.use(routers)


const server = http.createServer(app)


const port = process.env.PORT || 4000
const main = async () => {
    try {
        await connectDB()
        server.listen(port, () => {
            console.log(`App is running on port ${port}`)
        })

    } catch (error) {
        console.error(`Database connection failed: ${error.message}`)
    }
}

// called main function
main()

