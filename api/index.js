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

import cors from "cors";

app.use(cors({
  origin: "https://online-blogging-platform-5i72.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
// ------------------------------------------------

// ---------------- ROUTES ------------------------
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)

// ------------------------------------------------

// ---------------- ERROR HANDLER ------------------
app.use((err, req, res, next) => {
  console.log('Error handler called:', err);
  const statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  console.log('Error message:', message);
  if (typeof message !== 'string') {
    message = 'Internal server error'
  }
  console.log('Sending error response:', statusCode, message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
// -------------------------------------------------

// ---------------- START SERVER -------------------
async function startServer() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_CONN, { dbName: 'Blogging-Mern' })

    console.log('Database connected.')
    // Attempt to drop the problematic index only (non-destructive)
    console.log('Attempting to drop blogContent index if it exists')
    try {
      await Blog.collection.dropIndex('blogContent_1')
      console.log('Dropped blogContent index')
    } catch (err) {
      console.log('Index drop error (non-fatal):', err.message)
    }
    app.listen(PORT, () => console.log('Server running on port:', PORT))
  } catch (error) {
    console.error('Database connection failed:', error.message)
  }
}

startServer()
