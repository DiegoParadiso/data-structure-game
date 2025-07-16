import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './pages/Home';
import NavBar from './components/NavBar';
import BSTPage from './pages/BSTPage.jsx';
import HashExPage from './pages/HashExPage.jsx';
import GameModeSelection from './components/GameModeSelection'; 
import HeapGame from './pages/HeapPage.jsx'; 

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/ejercicio/seleccion' element={<GameModeSelection />} />
        <Route path='/ejercicio/bst' element={<BSTPage />} />
        <Route path='/ejercicio/hashingex' element={<HashExPage />} />
        <Route path="/ejercicio/heapgame" element={<HeapGame />} />
      </Routes>
    </Router>
  );
}

export default App;