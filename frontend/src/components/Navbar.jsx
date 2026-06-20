import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h1>Plannix</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar