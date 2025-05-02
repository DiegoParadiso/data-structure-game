import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Actualizamos para usar Routes
import Home from './pages/Home';  // Ruta correcta a 'Home.jsx'
import NavBar from './components/NavBar';
import BSTPage from './pages/BSTPage.jsx';
import AVLPage from './pages/AVLPage.jsx';
import GameModeSelection from './components/GameModeSelection'; 

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/ejercicio/seleccion' element={<GameModeSelection />} /> {/* Nueva ruta */}
        <Route path='/ejercicio/bst' element={<BSTPage />} />
        <Route path='/ejercicio/avl' element={<AVLPage />} />
      </Routes>
    </Router>
  );
}

export default App;