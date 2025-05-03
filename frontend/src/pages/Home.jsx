import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Home = () => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4">
      <div className="mt-10 text-center">
        <p className="text-base text-gray-700">
          ¿Listo para el desafío? Resuelve un ejercicio de Estructuras de Datos.
        </p>
      </div>

      {/* Contenedor de los boxes */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {/* Box 1 */}
        <div
          className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 cursor-pointer"
          onClick={() => handleRedirect('/ejercicio/seleccion')}
        >
          <img src={assets.arbol} alt="Árbol Binario" className="w-20 h-20" />
          <p className="text-sm text-center font-medium text-gray-800">
            Árbol Binario de Búsqueda (BST)
          </p>
        </div>

        {/* Box 2 */}
        <div
          className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 cursor-pointer"
        >
          <img src={assets.arbol} alt="Árbol AVL" className="w-20 h-20" />
          <p className="text-sm text-center font-medium text-gray-800">
            Árbol Binario Balanceado (AVL)
          </p>
        </div>

        {/* Box 3 */}
        <div
          className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 cursor-pointer"
        >
          <img src={assets.arbol} alt="Árboles n-arios" className="w-20 h-20" />
          <p className="text-sm text-center font-medium text-gray-800">
            Árboles n-arios
          </p>
        </div>

        {/* Próximamente (sin redirección) */}
        <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
          <p className="text-sm text-center font-medium text-gray-800">
            Hashing Básico
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
          <p className="text-sm text-center font-medium text-gray-800">
            Hashing con Encadenamiento y Direccionamiento Abierto
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between items-center h-52 border-dashed border-2 border-gray-400">
          <p className="text-lg font-medium text-gray-800">Próximamente</p>
          <p className="text-sm text-center font-medium text-gray-800">
            Funciones de Hash Modernas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;