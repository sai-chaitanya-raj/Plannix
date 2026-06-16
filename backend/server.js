const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/todos', require('./routes/todos'))

// Test route
app.get('/', (req, res) => {
  res.send('Plannix API is running!')
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err)
  })