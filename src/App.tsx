import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClimateHomepage from './components/ClimateHomepage'
import AboutPage from './components/AboutPage'
import ContactPage from './components/ContactPage'
import './index.css'

function App() {
  // Check if we're on the custom domain or GitHub Pages subdirectory
  const isCustomDomain = window.location.hostname === 'myclimatedefinition.org';
  const basename = isCustomDomain ? '' : '/myclimatechela-st';
  
  return (
    <Router basename={basename}>
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