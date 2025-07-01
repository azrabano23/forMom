import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-600 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇺🇸</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">N-400 Helper</span>
                <p className="text-xs text-gray-500">Naturalization Test Prep</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/civics" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Civics Test
            </Link>
            <Link to="/english" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              English Test
            </Link>
            <Link to="/speaking" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Speaking
            </Link>
            <Link to="/form-helper" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Form Helper
            </Link>
            <Link to="/interview" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Mock Interview
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-800">N-400 Helper</span>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-6">
                  <Link to="/" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/civics" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Civics Test
                  </Link>
                  <Link to="/english" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    English Test
                  </Link>
                  <Link to="/speaking" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Speaking Practice
                  </Link>
                  <Link to="/form-helper" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Form Helper
                  </Link>
                  <Link to="/interview" className="text-base font-medium text-gray-900 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    Mock Interview
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
