import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <h3 className="text-2xl font-bold text-white">AR CAD Editor</h3>
              <p className="mt-4 text-base text-gray-300">
                Revolutionary AR CAD editing for MetaQuest devices. Create, edit, and share CAD files in augmented reality.
              </p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#features" className="text-base text-gray-300 hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#tools" className="text-base text-gray-300 hover:text-white">
                      AR Tools
                    </a>
                  </li>
                  <li>
                    <a href="#converter" className="text-base text-gray-300 hover:text-white">
                      File Converter
                    </a>
                  </li>
                  <li>
                    <a href="#download" className="text-base text-gray-300 hover:text-white">
                      Download
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Technology</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-gray-300">Unity Engine</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">MetaQuest AR</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">Blender Integration</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">Supabase Backend</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="/docs" className="text-base text-gray-300 hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/api" className="text-base text-gray-300 hover:text-white">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="/tutorials" className="text-base text-gray-300 hover:text-white">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="/community" className="text-base text-gray-300 hover:text-white">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">File Formats</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-gray-300">STL Files</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">STEP Files</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">OBJ Files</span>
                  </li>
                  <li>
                    <span className="text-base text-gray-300">FBX Files</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Add social media icons here if needed */}
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2024 AR CAD Editor. Built with cutting-edge AR technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
