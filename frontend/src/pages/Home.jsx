import React from 'react';
import { useNavigate } from 'react-router-dom';
import { gamesConfig } from '../config/games';

const Home = () => {
  const navigate = useNavigate();
  const DEBUG_DISABLE_LIMIT = true;

  const getDailyData = () => JSON.parse(localStorage.getItem('dailyProgress')) || {};

  const hasPlayedToday = (gameKey) => {
    if (DEBUG_DISABLE_LIMIT) return false;
    const data = getDailyData();
    const today = new Date().toISOString().split('T')[0];
    return data[gameKey]?.lastPlay === today;
  };

  const getStreak = (gameKey) => {
    const data = getDailyData();
    return data[gameKey]?.streak || 0;
  };

  const renderCard = (gameKey, { label, icon: IconComponent, route, state }) => {
    const locked = hasPlayedToday(gameKey);
    const streak = getStreak(gameKey);

    return (
      <div
        key={gameKey}
        className={`relative bg-white shadow-sm ${
          locked ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
        } transition rounded-xl px-4 py-6 flex flex-col items-center justify-between h-36`}
        onClick={() =>
          !locked && navigate(route, { state: { exercise: gameKey, ...state } })
        }
      >
        {streak > 0 && (
          <div className="absolute top-2 right-2 bg-neutral-200 text-neutral-700 text-xs rounded-full px-2 py-[2px] flex items-center gap-1 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-orange-500" viewBox="0 0 24 24">
              <path d="M12 2C10.5 4.5 10 7 12 9c1.5 1.5 1 4-1 5-1.5 1-2-1-2-2s-.5-1.5-1-1.5C6 10.5 5 13 5 15.5 5 19 8 22 12 22s7-3 7-7c0-4-2-7-7-13z" />
            </svg>
            {streak}
          </div>
        )}

        <IconComponent className="w-12 h-12 opacity-90 text-gray-700" />
        <p className="text-sm text-center text-gray-700 font-medium">
          {label}
          {locked && <span className="block text-xs text-red-500 mt-1">Vuelve Mañana</span>}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-neutral-100">
      <header className="mt-12 text-center space-y-1">
        <h1 className="text-xl font-semibold text-gray-800">¿Listo para el desafío?</h1>
        <p className="text-sm text-gray-600">Resuelve un ejercicio diario de Estructuras de Datos</p>
      </header>

      <main className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {Object.entries(gamesConfig).map(([gameKey, config]) => renderCard(gameKey, config))}

        {[...Array(3)].map((_, i) => (
          <div
            key={`soon-${i}`}
            className="bg-white shadow-sm rounded-xl flex flex-col justify-center items-center h-36 border border-dashed border-gray-300 text-gray-500"
          >
            <p className="text-sm font-medium">Próximamente</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
