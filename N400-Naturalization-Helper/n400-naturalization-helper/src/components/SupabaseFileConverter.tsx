import React, { useState, useCallback } from 'react';
import { uploadFile, getFileUrl } from '../lib/supabase';

interface ConvertedFile {
  name: string;
  url: string;
  uploadedAt: Date;
}

const SupabaseFileConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  
  // Check if Supabase is properly configured
  const isSupabaseConfigured = process.env.REACT_APP_SUPABASE_URL && 
    process.env.REACT_APP_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    process.env.REACT_APP_SUPABASE_ANON_KEY && 
    process.env.REACT_APP_SUPABASE_ANON_KEY !== 'your-anon-key-here';

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      setSelectedFile(file);
      setUploadedFileUrl(null);
    } else {
      alert('Please select a valid STL file');
    }
  }, []);

  const handleUploadToSupabase = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const { fileName } = await uploadFile(selectedFile, 'stl-files');
      const fileUrl = getFileUrl(fileName, 'stl-files');
      setUploadedFileUrl(fileUrl);
      alert('File uploaded to Supabase successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check your Supabase configuration.');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Convert file using backend
      const response = await fetch('http://localhost:3001/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      // Get the converted file blob
      const blob = await response.blob();
      const convertedFile = new File([blob], selectedFile.name.replace('.stl', '.fbx'), {
        type: 'application/octet-stream'
      });

      // Upload converted file to Supabase
      const { fileName } = await uploadFile(convertedFile, 'fbx-files');
      const fileUrl = getFileUrl(fileName, 'fbx-files');

      // Add to converted files list
      const newConvertedFile: ConvertedFile = {
        name: fileName,
        url: fileUrl,
        uploadedAt: new Date()
      };
      setConvertedFiles(prev => [newConvertedFile, ...prev]);

      // Also download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name.replace('.stl', '.fbx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Conversion completed! File converted, downloaded, and saved to Supabase.');
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile]);

  return (
    <div className="bg-dark-800 p-10 rounded-2xl border border-primary-500/20 shadow-2xl max-w-6xl mx-auto my-16">
      <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent text-center mb-8">
        STL to FBX Converter with Cloud Storage
      </h3>
      
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-primary-500/30 rounded-xl p-10 text-center mb-8 hover:border-primary-400 transition-all duration-300 bg-dark-900/50">
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

      {/* File Actions */}
      {selectedFile && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Selected File</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Name:</strong> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            
            <button
              onClick={handleUploadToSupabase}
              disabled={isUploading}
              className={`w-full mb-3 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                isUploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 cursor-pointer'
              }`}
            >
              {isUploading ? 'Uploading to Cloud...' : 'Upload to Supabase'}
            </button>

            {uploadedFileUrl && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 mb-2">✓ Uploaded to cloud!</p>
                <a 
                  href={uploadedFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:text-green-800 break-all"
                >
                  View in cloud storage
                </a>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Convert & Store</h4>
            <p className="text-sm text-gray-600 mb-4">
              Convert to FBX format and automatically save to cloud storage.
            </p>
            
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                isConverting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
              }`}
            >
              {isConverting ? 'Converting & Uploading...' : 'Convert to FBX'}
            </button>
          </div>
        </div>
      )}

      {/* Converted Files List */}
      {convertedFiles.length > 0 && (
        <div className="border-t pt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-6">Converted Files in Cloud Storage</h4>
          <div className="space-y-4">
            {convertedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {file.uploadedAt.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View
                  </a>
                  <a
                    href={file.url}
                    download
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supabase Integration Info */}
      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <h4 className="text-blue-800 font-semibold mb-3">☁️ Supabase Cloud Storage</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-700 mb-2">Features:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• Secure cloud file storage</li>
              <li>• Automatic backup & versioning</li>
              <li>• Global CDN delivery</li>
              <li>• Real-time file access</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 mb-2">Setup Required:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• Create Supabase project</li>
              <li>• Add environment variables</li>
              <li>• Configure storage buckets</li>
              <li>• Set up file policies</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> To enable Supabase integration, add your REACT_APP_SUPABASE_URL and 
            REACT_APP_SUPABASE_ANON_KEY to your environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseFileConverter;
