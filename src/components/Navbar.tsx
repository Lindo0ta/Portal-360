import { Bell, Search, User } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/360.png" alt="Portal 360" className="navbar-logo-img" />
        <div className="navbar-brand">
          <span className="brand-title">PORTAL <strong>360</strong></span>
          <span className="brand-subtitle">Tu viaje por Uniminuto<br />Sede Bogotá empieza aquí.</span>
        </div>
      </div>
      <div className="navbar-links">
        <a href="#" className="nav-link active">INICIO</a>
        <a href="#" className="nav-link">EXPLORAR</a>
        <a href="#" className="nav-link">MISIONES</a>
        <a href="#" className="nav-link">CUENTA</a>
        <div className="nav-icons">
          <Bell size={20} className="nav-icon" />
          <Search size={20} className="nav-icon" />
          <User size={20} className="nav-icon" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
