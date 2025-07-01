import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="mb-8">
          <div className="inline-block px-6 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
            <span className="text-blue-700 text-sm font-semibold tracking-wide uppercase">🇺🇸 Official Practice Tests</span>
          </div>
        </div>
        
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
          <span className="block text-gray-900">N-400 Naturalization</span>
          <span className="relative whitespace-nowrap bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            <span className="relative">Test Helper</span>
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-3xl text-xl tracking-tight text-slate-700">
          Master your U.S. Naturalization Test with AI-powered practice sessions. 
          Get ready for the civics test, English evaluation, and interview with confidence.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-x-6">
          <Link
            to="/civics"
            className="group inline-flex items-center justify-center rounded-xl py-4 px-8 text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700 active:from-blue-800 active:to-red-800 focus-visible:outline-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Civics Practice 🇺🇸
          </Link>
          <Link
            to="/interview"
            className="group inline-flex ring-2 items-center justify-center rounded-xl py-4 px-8 text-lg font-semibold focus:outline-none ring-gray-300 text-gray-700 hover:text-gray-900 hover:ring-gray-400 hover:bg-gray-50 active:bg-gray-100 active:text-gray-600 focus-visible:outline-blue-600 focus-visible:ring-gray-300 transform hover:scale-105 transition-all duration-200"
          >
            Mock Interview 🎤
          </Link>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">100+</div>
            <div className="text-sm text-gray-600 mt-1">Civics Questions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600">AI</div>
            <div className="text-sm text-gray-600 mt-1">Powered Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">Free</div>
            <div className="text-sm text-gray-600 mt-1">Practice Tool</div>
          </div>
        </div>
        
        <div className="mt-20 lg:mt-24">
          <p className="font-display text-base text-slate-900">Choose your practice test below</p>
          <div className="mt-8 flex justify-center">
            <ArrowDownIcon className="h-8 w-8 text-slate-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
