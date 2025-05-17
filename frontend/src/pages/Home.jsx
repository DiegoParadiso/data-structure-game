import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-gray-100 ">
      <div className="mt-10 text-center">
        <h1 className="text-xl font-bold text-gray-800 pb-2">
          ¿Listo para el desafío?
        </h1>
        <p className="text-gray-800 pb-2">
          Resuelve un ejercicio de Estructuras de Datos.
        </p>
      </div>

      {/* Contenedor de los boxes */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {/* Box 1 */}
        <div
          className="font-mono bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl px-5 py-6 flex flex-col justify-between items-center h-52 cursor-pointer"
          onClick={() => navigate('/ejercicio/seleccion', { state: { exercise: 'bst' } })}
        >
          <img src={assets.arbol} alt="Árbol Binario" className="w-14 h-14" />
          <p className="text-sm text-center font-medium text-gray-800">
            Árbol Binario de Búsqueda
          </p>
        </div>

        {/* Box 2 */}
        <div
          className="font-mono bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl px-5 py-6 flex flex-col justify-between items-center h-52 cursor-pointer"
          onClick={() => navigate('/ejercicio/seleccion', { state: { exercise: 'hashingex' } })}
        >
          <img src={assets.arbol} alt="Hash Extensible" className="w-14 h-14" />
          <p className="text-sm text-center font-medium text-gray-800">
            Hash Extensible
          </p>
        </div>

        {/* Box 3 */}
        <div
          className="font-mono bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl px-5 py-6 flex flex-col justify-between items-center h-52 cursor-pointer"
        >
          <img src={assets.arbol} alt="Árboles n-arios" className="w-14 h-14" />
          <p className="text-sm text-center font-medium text-gray-800">
            Árboles n-arios
          </p>
        </div>

        {/* Próximamente... */}
        <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl px-5 py-6 flex flex-col justify-between pt-20 items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl px-5 py-6 flex flex-col justify-between pt-20 items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl flex flex-col justify-between pt-20 items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
        </div>
      </div>
    </div>
  );
};

export default Home;