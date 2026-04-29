
import express from "express"
import cors from "cors"

import cookieParser from "cookie-parser"

import studentRouter from "./routes/student.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/api/students', studentRouter)
app.use('/api/attendance', attendanceRouter)


app.get('/', (req, res) => {
    res.json({ message: 'DBMS-MPR Server is running' })
})

export default app