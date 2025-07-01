import React, { useState, useCallback } from 'react';

const SimpleFileConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid STL file');
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

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

      alert('Conversion completed! File downloaded.');
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile]);

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto my-10">
      <h3 className="text-primary-600 text-2xl font-bold text-center mb-6">
        STL to FBX Converter
      </h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6 hover:border-primary-500 transition-colors">
        <input
          type="file"
          accept=".stl"
          onChange={handleFileSelect}
          className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          id="file-upload"
        />
        <p className="text-gray-500 text-sm">
          {selectedFile ? selectedFile.name : 'Select an STL file to convert to FBX'}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          STL files only, up to 50MB
        </p>
      </div>

      {selectedFile && (
        <div className="text-center">
          <p className="mb-4 text-gray-700">
            <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <button
            onClick={handleConvert}
            disabled={isConverting}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isConverting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
            }`}
          >
            {isConverting ? 'Converting...' : 'Convert to FBX'}
          </button>
        </div>
      )}

      <div className="bg-gray-100 p-5 rounded-lg mt-8">
        <h4 className="text-gray-700 font-semibold mb-3">How it works:</h4>
        <ul className="text-gray-600 text-sm text-left space-y-1">
          <li>• Upload your STL file</li>
          <li>• Backend server uses Blender to convert STL to FBX</li>
          <li>• Download the converted FBX file</li>
          <li>• Use in Unity for AR applications</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleFileConverter;
