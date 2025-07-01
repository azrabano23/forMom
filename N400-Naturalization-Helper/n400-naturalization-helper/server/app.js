const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/sla' || path.extname(file.originalname).toLowerCase() === '.stl') {
      cb(null, true);
    } else {
      cb(new Error('Only STL files are allowed'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CAD Editor Backend Server is running!' });
});

app.post('/api/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = path.join('./converted', req.file.filename.replace('.stl', '.fbx'));
  const convertedDir = './converted';

  try {
    // Create converted directory if it doesn't exist
    if (!fs.existsSync(convertedDir)) {
      fs.mkdirSync(convertedDir, { recursive: true });
    }

    // Run the Blender conversion script
    await runBlenderConversion(inputPath, outputPath);

    // Send the converted file
    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download converted file' });
      }
      
      // Clean up files after download
      setTimeout(() => {
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }, 5000);
    });

  } catch (error) {
    console.error('Conversion error:', error);
    
    // Clean up input file on error
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    res.status(500).json({ error: 'Conversion failed: ' + error.message });
  }
});

function runBlenderConversion(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Path to the Python conversion script (copy from the existing one)
    const scriptPath = path.join(__dirname, '../convert_stl_to_fbx.py');
    
    // Copy the existing Python script to server directory if it doesn't exist
    const originalScriptPath = path.join(__dirname, '../../convert_stl_to_fbx.py');
    if (!fs.existsSync(scriptPath) && fs.existsSync(originalScriptPath)) {
      fs.copyFileSync(originalScriptPath, scriptPath);
    }

    // Blender command - adjust path based on system
    const blenderPath = process.platform === 'win32' 
      ? 'C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe'
      : '/Applications/Blender.app/Contents/MacOS/Blender'; // macOS path

    const args = [
      '--background',
      '--python', scriptPath,
      '--', inputPath, outputPath
    ];

    const blenderProcess = spawn(blenderPath, args);

    blenderProcess.stdout.on('data', (data) => {
      console.log(`Blender stdout: ${data}`);
    });

    blenderProcess.stderr.on('data', (data) => {
      console.error(`Blender stderr: ${data}`);
    });

    blenderProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Blender process exited with code ${code}`));
      }
    });

    blenderProcess.on('error', (error) => {
      reject(new Error(`Failed to start Blender: ${error.message}`));
    });
  });
}

// Serve converted files
app.use('/converted', express.static('./converted'));

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
