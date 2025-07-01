import React, { useState, useCallback } from 'react';
import { CloudArrowUpIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FileConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      setSelectedFile(file);
      setConvertedFileUrl(null);
    } else {
      alert('Please select a valid STL file');
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setConversionProgress(0);

    // Simulate conversion progress
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Create FormData and send to backend
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Send to backend API
      const response = await fetch('http://localhost:3001/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.stl', '.fbx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setConversionProgress(100);
      setConvertedFileUrl(url);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      clearInterval(progressInterval);
      setIsConverting(false);
    }
  }, [selectedFile]);

  const handleDownload = useCallback(() => {
    if (convertedFileUrl) {
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = convertedFileUrl;
      link.download = selectedFile?.name.replace('.stl', '.fbx') || 'converted.fbx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [convertedFileUrl, selectedFile]);

  return (
    <div id="converter" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">File Converter</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Convert STL to FBX
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Upload your STL files and convert them to FBX format for use in Unity and AR applications.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept=".stl"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to upload STL file or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">STL files only, up to 50MB</p>
                </div>
              </label>
            </div>

            {/* Conversion Controls */}
            {selectedFile && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Selected file:</p>
                    <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isConverting ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Converting...
                      </>
                    ) : (
                      'Convert to FBX'
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                {isConverting && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Converting...</span>
                      <span>{conversionProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${conversionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Download Link */}
                {convertedFileUrl && !isConverting && (
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Conversion completed!</p>
                        <p className="text-sm text-green-600">Your FBX file is ready for download.</p>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Download FBX
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700">Backend Technology</h4>
                <p className="text-gray-600">Node.js/Flask server with Blender integration</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Conversion Engine</h4>
                <p className="text-gray-600">Blender and FreeCAD converters</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">File Storage</h4>
                <p className="text-gray-600">Supabase cloud storage</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Supported Formats</h4>
                <p className="text-gray-600">STL → FBX conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
