const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, async (req, res) => {
  const { title, description, priority } = req.body

  try {
    const todo = await Todo.create({
      user: req.user.id,
      title,
      description,
      priority
    })

    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(todos)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})


router.put('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if(!todo){
      return res.status(404).json({ message: 'Todo not found' })
    }

    // Make sure user owns the todo
    if(todo.user.toString() !== req.user.id){
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedTodo)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if(!todo){
      return res.status(404).json({ message: 'Todo not found' })
    }

    if(todo.user.toString() !== req.user.id){
      return res.status(401).json({ message: 'Not authorized' })
    }

    await todo.deleteOne()
    res.status(200).json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if(!todo){
      return res.status(404).json({ message: 'Todo not found' })
    }

    if(todo.user.toString() !== req.user.id){
      return res.status(401).json({ message: 'Not authorized' })
    }

    todo.completed = !todo.completed
    await todo.save()

    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router