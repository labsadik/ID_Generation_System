import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify/:uid" element={<Verify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;