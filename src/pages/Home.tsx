import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import OrbitSystem from '../components/OrbitSystem'

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <main className="main-content">

        {/* Zorro + Badge — flex row, alineados al centro verticalmente */}
        <motion.div 
          className="mascot-row"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Zorro */}
          <img src="/zorro.png" alt="Foxy mascota" className="mascot-img" />

          {/* Badge a la derecha del zorro */}
          <motion.div
            className="welcome-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            ¡BIENVENIDO/A!
          </motion.div>
        </motion.div>

        <div className="mascot-divider" />
        {/* Subtítulo */}
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Accede a las herramientas principales y navega por el ecosistema central 360. <br />
          Pasa el raton por encima de los planetas en orbita para que descubras que puedes encontrar.
        </motion.p>

        {/* Sistema orbital */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <OrbitSystem />
        </motion.div>
      </main>

      <footer className="footer">
        <span>Soporte</span>
        <span>|</span>
        <span>Mapa</span>
        <span>|</span>
        <span>Términos</span>
        <span>|</span>
        <span>© 2026 Portal 360</span>
      </footer>
    </div>
  )
}

export default Home