import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
  return (
    <nav className="relative text-white p-4 flex items-center justify-center shadow-lg overflow-hidden">
      {/* Fondo degradado animado en grises oscuros */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 animate-gradient bg-[length:200%_200%] z-0"></div>

      <div className="z-10 flex items-center justify-center">
        <Link to="/">
          <img src={assets.logoSIT} alt="Logo" className="w-12 filter invert cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;