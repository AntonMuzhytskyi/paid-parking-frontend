import React from 'react';
import Belysamuray from '../assets/belysamuray.svg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="relative bg-deepBlack border-b-8 border-samuraiRed overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-darkSlate to-deepBlack opacity-70"></div>

      <div className="relative container mx-auto px-6 py-10">
        {/* Логотип и название по центру */}
        <div className="text-center">
          <img
            src={Belysamuray}
            alt="Белый Самурай"
            className="mx-auto h-32 drop-shadow-2xl animate-pulse-slow"
          />
          <h1 className="mt-6 text-6xl md:text-7xl font-bold tracking-wider" style={{ fontFamily: 'Zen Kurenaido, serif' }}>
            Samurai Parking
          </h1>
          <p className="mt-4 text-2xl text-goldAccent opacity-90">
            Paid Parking System
          </p>
        </div>

        {/* Logout button */}
        {token && (
          <div className="absolute top-8 right-8">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-bloodRed hover:bg-samuraiRed border-2 border-samuraiRed rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-samurai"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
