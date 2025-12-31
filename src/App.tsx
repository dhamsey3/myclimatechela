import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ClimateHomepage from './components/ClimateHomepage'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import ReadingProgress from './components/ReadingProgress'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ClimateHomepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ReadingProgress />
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App