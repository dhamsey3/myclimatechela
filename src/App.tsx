import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClimateHomepage from './components/ClimateHomepage'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import './index.css'

function App() {
  return (
    <Router basename="/myclimatechela-st">
      <div className="App">
        <Routes>
          <Route path="/" element={<ClimateHomepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App