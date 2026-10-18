import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
        {/* Addresses of the pre-redesign static pages, still in search results and old links */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
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