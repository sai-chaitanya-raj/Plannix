import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/todos')
      setTodos(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if(!title.trim()) return

    try {
      const res = await axios.post('/todos', { title, description, priority })
      setTodos([res.data, ...todos])
      setTitle('')
      setDescription('')
      setPriority('medium')
    } catch (err) {
      console.log(err)
    }
  }

  const handleToggleComplete = async (id) => {
    try {
      const res = await axios.patch(`/todos/${id}/complete`)
      setTodos(todos.map(todo => todo._id === id ? res.data : todo))
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/todos/${id}`)
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const filteredTodos = todos.filter(todo => {
    if(filter === 'active') return !todo.completed
    if(filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-content">
        <h2>Welcome, {user?.name}!</h2>

        <p>{completedCount} / {todos.length} completed</p>

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add Todo</button>
        </form>

        <div className="filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('active')}>Active</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <div className="todo-list">
          {filteredTodos.map(todo => (
            <div key={todo._id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
              <div onClick={() => handleToggleComplete(todo._id)} className="todo-info">
                <h4>{todo.title}</h4>
                <p>{todo.description}</p>
                <span className={`priority ${todo.priority}`}>{todo.priority}</span>
              </div>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard