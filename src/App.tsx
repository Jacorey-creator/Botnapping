import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CluePage from './components/CluePage'
import VictoryPage from './components/VictoryPage'
import './styles/App.module.css'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clue/:id" element={<CluePage />} />
          <Route path="/victory" element={<VictoryPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App 