// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaChartBar } from 'react-icons/fa';
import { assets } from '../assets/assets';

const Navbar = () => {
  return (
    <nav className="bg-gray-600 text-white p-4 relative flex items-center justify-center shadow-lg">
      {/* Iconos a la izquierda, cerca del centro */}
      <div className="absolute left-1/4 -translate-x-1/2 flex items-center space-x-3 z-10">
        <Link to="/how-to-play" className="hover:text-yellow-300">
          <FaInfoCircle className="text-3xl text-white" />
        </Link>
        <Link to="/stats" className="hover:text-yellow-300">
          <FaChartBar className="text-3xl text-white" />
        </Link>
      </div>

      {/* Logo centrado */}
      <div className="flex items-center justify-center">
        <Link to="/">
        <img src={assets.gamelogo} alt="Logo" className="w-12 h-12 filter invert cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;