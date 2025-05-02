// GameModeSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameModeSelection = () => {
  const [mode, setMode] = useState('easy');
  const [timer, setTimer] = useState('noTimer');
  const navigate = useNavigate();

  const handleStartGame = () => {
    // Pasamos el modo y el temporizador como parte de la URL (o un objeto de estado) para ser usados en el juego.
    navigate('/ejercicio/bst', { state: { mode, timer } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
      <h2 className="pt-20 pb-6 text-xl text-center font-medium text-gray-800">Selecciona tu Modo de Juego</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        {/* Dificultad */}
        <div className="p-4 border rounded-lg shadow-md">
          <div>
            <button
              onClick={() => setMode('easy')}
              className={`p-2 w-full ${mode === 'easy' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
            >
              Fácil
            </button>
            <button
              onClick={() => setMode('normal')}
              className={`p-2 w-full ${mode === 'normal' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
            >
              Normal
            </button>
            <button
              onClick={() => setMode('hard')}
              className={`p-2 w-full ${mode === 'hard' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded`}
            >
              Difícil
            </button>
          </div>
        </div>

        {/* Temporizador */}
        <div className="p-4 border rounded-lg shadow-md">
          <div>
            <button
              onClick={() => setTimer('noTimer')}
              className={`p-2 w-full ${timer === 'noTimer' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
            >
              Sin Temporizador
            </button>
            <button
              onClick={() => setTimer('40s')}
              className={`p-2 w-full ${timer === '40s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
            >
              40 segundos
            </button>
            <button
              onClick={() => setTimer('20s')}
              className={`p-2 w-full ${timer === '20s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
            >
              20 segundos
            </button>
            <button
              onClick={() => setTimer('10s')}
              className={`p-2 w-full ${timer === '10s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded`}
            >
              10 segundos
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleStartGame}
        className="w-full max-w-md mt-8 px-6 py-2 rounded bg-gray-600 text-white hover:bg-gray-800"
      >
        Iniciar Juego
      </button>
    </div>
  );
};

export default GameModeSelection;