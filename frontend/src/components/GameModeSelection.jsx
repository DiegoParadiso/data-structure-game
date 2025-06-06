import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GameModeSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos el ejercicio desde el estado de la navegación (default 'bst')
  const exercise = location.state?.exercise || 'bst';

  const [mode, setMode] = useState('easy');
  const [timer, setTimer] = useState('noTimer');

  const handleStartGame = () => {
    // Navegamos a la página del ejercicio, pasando mode y timer
    navigate(`/ejercicio/${exercise}`, { state: { mode, timer } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
      <div className="pt-20 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
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

        <div className="p-4 border rounded-lg shadow-md">
  <div>
    <button
      onClick={() => setTimer('noTimer')}
      className={`p-2 w-full ${timer === 'noTimer' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      Sin Temporizador
    </button>

    {exercise === 'hashingex' ? (
  <>
    <button
      onClick={() => setTimer('90s')}
      className={`p-2 w-full ${timer === '90s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      90 segundos
    </button>
    <button
      onClick={() => setTimer('60s')}
      className={`p-2 w-full ${timer === '60s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      60 segundos
    </button>
    <button
      onClick={() => setTimer('35s')}
      className={`p-2 w-full ${timer === '35s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded`}
    >
      35 segundos
    </button>
  </>
) : exercise === 'heap' ? (
  <>
    <button
      onClick={() => setTimer('40s')}
      className={`p-2 w-full ${timer === '40s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      40 segundos
    </button>
    <button
      onClick={() => setTimer('30s')}
      className={`p-2 w-full ${timer === '30s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      30 segundos
    </button>
    <button
      onClick={() => setTimer('25s')}
      className={`p-2 w-full ${timer === '25s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded`}
    >
      25 segundos
    </button>
  </>
) : (
  <>
    <button
      onClick={() => setTimer('35s')}
      className={`p-2 w-full ${timer === '35s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      35 segundos
    </button>
    <button
      onClick={() => setTimer('20s')}
      className={`p-2 w-full ${timer === '20s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded mb-2`}
    >
      20 segundos
    </button>
    <button
      onClick={() => setTimer('15s')}
      className={`p-2 w-full ${timer === '15s' ? 'bg-gray-600 text-white' : 'bg-gray-200'} rounded`}
    >
      15 segundos
    </button>
  </>
)}
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