const multer = require('multer');
const path = require('path');

// Configure memory storage
const storage = multer.memoryStorage();

// Allowed MIME types and file extensions
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const allowedExtensions = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|jpg|jpeg|png|webp/;

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeTypeMatches = allowedMimeTypes.includes(file.mimetype);
  const extensionMatches = allowedExtensions.test(ext);

  if (mimeTypeMatches || extensionMatches) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type '.${ext}'. Allowed formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, JPG, PNG, WEBP`
      ),
      false
    );
  }
};

// Multer upload instance (10 MB size limit)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter
});

// Middleware wrapper to catch Multer errors gracefully
const handleSingleUpload = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds the 10 MB limit'
          });
        }
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

module.exports = {
  upload,
  handleSingleUpload
};
