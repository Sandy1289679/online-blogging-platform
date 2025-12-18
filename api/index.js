import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import BlogRoute from './routes/BlogRoute.js'
import CommentRoute from './routes/CommentRoute.js'
import Blog from './models/blog.model.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

// ---------------- MIDDLEWARES ----------------
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ CORS (FIXED)
app.use(cors({
  origin: "https://online-blogging-platform-5i72.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}))

// ✅ Handle preflight explicitly
app.options("*", cors())

// ---------------- ROUTES ----------------
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error('Error handler:', err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})

// ---------------- START SERVER ----------------
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_CONN, {
      dbName: 'Blogging-Mern'
    })

    console.log('Database connected')

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    )
  } catch (error) {
    console.error('Database connection failed:', error.message)
  }
}

startServer()
