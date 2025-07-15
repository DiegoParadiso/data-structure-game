import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';


const Home = () => {
  const navigate = useNavigate();

  const DEBUG_DISABLE_LIMIT = true;

  const hasPlayedToday = (gameKey) => {
    if (DEBUG_DISABLE_LIMIT) return false; // nunca bloquear si debug activado
    const data = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const today = new Date().toISOString().split('T')[0];
    return data[gameKey]?.lastPlay === today;
  };

  const renderCard = (gameKey, label, image, route) => {
    const locked = hasPlayedToday(gameKey);
    return (
      <div
        className={`font-mono bg-white/90 backdrop-blur-sm shadow-md ${
          locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl cursor-pointer'
        } transition-all duration-300 rounded-2xl px-5 py-6 flex flex-col justify-between items-center h-52`}
        onClick={() => !locked && navigate(route, { state: { exercise: gameKey } })}
      >
        <img src={image} alt={label} className="w-14 h-14" />
        <p className="text-sm text-center font-medium text-gray-800">
          {label}
          {locked && <span className="block text-xs text-red-500 mt-1">Ya jugaste hoy</span>}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-gray-100 ">
      <div className="mt-10 text-center">
        <h1 className="text-xl font-bold text-gray-800 pb-2">¿Listo para el desafío?</h1>
        <p className="text-gray-800 pb-2">Resuelve un ejercicio de Estructuras de Datos.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {renderCard('bst', 'Árbol Binario de Búsqueda', assets.arbol, '/ejercicio/seleccion')}
        {renderCard('hashingex', 'Hash Extensible', assets.arbol, '/ejercicio/seleccion')}
        {renderCard('heap', 'Max-Heap y Min-Heap', assets.arbol, '/ejercicio/seleccion')}

        {/* Próximamente... */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl flex flex-col justify-between pt-20 items-center h-52 border-dashed border-2 border-gray-400">
            <p className="text-lg font-medium text-gray-800">Próximamente</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
