import React from 'react';
import { Database } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  return (
    <header className={`py-5 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database size={28} className="text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">
                <span className="gradient-text">AI Data Agent</span>
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Answering complex analytical questions
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <a 
              href="#examples" 
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Examples
            </a>
            <a 
              href="#about" 
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              About
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;