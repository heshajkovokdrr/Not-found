import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ModeSelectorImage from '../assets/images/selector2.jpg';
import { useSelector } from 'react-redux';

function GameModeSelector() {
  const [animate, setAnimate] = useState(false);
  const userData = useSelector(state => state.auth?.userData);
  
  useEffect(() => {
    console.log("Component Mounted");
    setAnimate(true);
  }, []);

  const gameModes = [
    { path: '/global-multiplayer', label: 'Global Multiplayer', delay: 'delay-100' },
    { path: '/local-multiplayer', label: 'Local Multiplayer', delay: 'delay-200' },
    { path: '/against-stockfish', label: 'Against Stockfish', delay: 'delay-300' },
    { path: '/puzzle', label: 'Puzzles', delay: 'delay-400' },
    { path: '/random-play', label: 'Random Play (Always win)', delay: 'delay-500' }
  ];

  return (
    <div className='flex h-screen items-center justify-center w-screen'>
      <div className="w-full h-screen bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${ModeSelectorImage})` }}>
        
        <div className='flex flex-col items-center justify-center h-full w-full'>
          {gameModes.map(({ path, label }) => (
            <div key={path} className="w-2/3 md:w-1/2 lg:w-1/3">
              <div className="bg-gray-800 transition duration-300 border border-white hover:bg-gray-300 transform transition duration-300 hover:scale-105 bg-opacity-40 backdrop-filter backdrop-blur-xl border border-gray-500 p-4 my-4 rounded-xl shadow-lg w-full mx-auto">
                <Link to={path} className="text-gray-100 text-xl lg:text-3xl text-center block hover:text-green-200">
                  {label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameModeSelector;
