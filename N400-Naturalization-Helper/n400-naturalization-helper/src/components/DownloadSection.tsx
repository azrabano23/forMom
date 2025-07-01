import React from 'react';

const DownloadSection: React.FC = () => {
  const handleDownloadUnity = () => {
    // For now, this will be a placeholder. You can replace with actual download link
    alert('Unity app download will be available soon! Check back later for the latest version.');
  };

  const handleDownloadAPK = () => {
    // Placeholder for APK download
    alert('MetaQuest APK download will be available soon!');
  };

  return (
    <div id="download" className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
      <div className="max-w-6xl mx-auto px-5 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">
          Download AR CAD Editor
        </h2>
        <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
          Get started with AR CAD editing on your MetaQuest device. Download the Unity application 
          or install directly on your headset.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Unity Download */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 9.604l-5.598-5.598L12 10.408 5.598 4.006 0 9.604l6.402 6.402L0 22.408l5.598 5.598L12 21.604l6.402 6.402L24 22.408l-6.402-6.402L24 9.604zM5.598 16.006L2.426 12.834l3.172-3.172 3.172 3.172-3.172 3.172zm6.402-9.598l3.172-3.172L18.344 6.408l-3.172 3.172L12 6.408zm0 12l3.172 3.172-3.172 3.172-3.172-3.172L12 18.408zm6.402-1.598l-3.172-3.172 3.172-3.172 3.172 3.172-3.172 3.172z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Unity Project</h3>
              <p className="text-gray-600 mb-6">
                Download the complete Unity project for development and customization.
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full Unity project source
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                MetaQuest AR support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                All conversion scripts included
              </div>
            </div>

            <button
              onClick={handleDownloadUnity}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Download Unity Project
            </button>
          </div>

          {/* MetaQuest APK */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">MetaQuest App</h3>
              <p className="text-gray-600 mb-6">
                Ready-to-install APK for your MetaQuest headset. Start using immediately.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ready-to-install APK
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                MetaQuest 2 & 3 support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant AR CAD editing
              </div>
            </div>

            <button
              onClick={handleDownloadAPK}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Download for MetaQuest
            </button>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">System Requirements</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-primary-100 mb-2">Unity Development</h4>
              <ul className="text-primary-200 text-sm space-y-1">
                <li>• Unity 2022.3 LTS or newer</li>
                <li>• Windows 10/11 or macOS 12+</li>
                <li>• 8GB RAM minimum</li>
                <li>• OpenXR SDK support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-100 mb-2">MetaQuest Device</h4>
              <ul className="text-primary-200 text-sm space-y-1">
                <li>• MetaQuest 2 or MetaQuest 3</li>
                <li>• Developer mode enabled</li>
                <li>• 2GB free storage space</li>
                <li>• Latest firmware version</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;
