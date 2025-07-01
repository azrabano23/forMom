import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇺🇸</span>
              </div>
              <h3 className="text-xl font-bold">N-400 Helper</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your comprehensive guide to U.S. naturalization. Practice civics, English, speaking, 
              and interview skills with AI-powered feedback to prepare for your citizenship test.
            </p>
            <div className="text-sm text-gray-400">
              <p className="mb-2">🎯 Practice at Your Own Pace</p>
              <p className="mb-2">📚 100+ Practice Questions</p>
              <p>🤖 AI-Powered Learning</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Practice Tests</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/civics" className="hover:text-white transition-colors">Civics Questions</Link></li>
              <li><Link to="/english" className="hover:text-white transition-colors">English Test</Link></li>
              <li><Link to="/speaking" className="hover:text-white transition-colors">Speaking Practice</Link></li>
              <li><Link to="/interview" className="hover:text-white transition-colors">Mock Interview</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/form-helper" className="hover:text-white transition-colors">N-400 Form Help</Link></li>
              <li><a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">USCIS Official Materials</a></li>
              <li><a href="https://www.uscis.gov/citizenship/2020-version-of-the-civics-test" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official 100 Questions</a></li>
              <li><a href="https://www.uscis.gov/n-400" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">N-400 Application</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
            <p>&copy; 2024 N-400 Naturalization Helper. Built to help future Americans succeed.</p>
            <div className="mt-4 md:mt-0 text-sm">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                ⚠️ Unofficial Practice Tool - Always refer to USCIS.gov for official information
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
