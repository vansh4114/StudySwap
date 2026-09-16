const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from Multer
 * @param {string} fileName - Original file name
 * @returns {Promise<Object>} Cloudinary upload response object
 */
const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    // Sanitize file name for public_id
    const sanitizedName = fileName
      ? fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'file';
    const publicId = `${Date.now()}_${sanitizedName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'studyswap_resources',
        resource_type: 'auto',
        public_id: publicId
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    const stream = new Readable();
    stream._read = () => {};
    stream.push(fileBuffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Deletes an asset from Cloudinary
 * @param {string} publicId - Cloudinary asset public_id
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary asset cleanup error:', error.message);
  }
};

/**
 * Generates a Cloudinary download URL with fl_attachment transformation flag
 * @param {Object} resource - Resource model instance or object
 * @returns {string} Download URL with attachment flag
 */
const generateDownloadUrl = (resource) => {
  if (!resource) return '';
  const { cloudinaryPublicId, fileUrl, fileName, fileType } = resource;

  const originalName = fileName || 'download';
  const nameWithoutExt = originalName.includes('.')
    ? originalName.substring(0, originalName.lastIndexOf('.'))
    : originalName;
  const ext = originalName.includes('.')
    ? originalName.split('.').pop().toLowerCase()
    : (fileType || '').toLowerCase();

  // Sanitize filename for Cloudinary transformation string
  const safeBaseName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_') || 'file';

  if (cloudinaryPublicId) {
    try {
      let resourceType = 'image';
      if (fileUrl && fileUrl.includes('/raw/upload/')) {
        resourceType = 'raw';
      } else if (fileUrl && fileUrl.includes('/video/upload/')) {
        resourceType = 'video';
      }

      const options = {
        secure: true,
        resource_type: resourceType,
        flags: `attachment:${safeBaseName}`
      };

      if (resourceType !== 'raw') {
        options.format = ext || 'pdf';
      }

      return cloudinary.url(cloudinaryPublicId, options);
    } catch (err) {
      console.error('Cloudinary url generation error, falling back to fileUrl:', err.message);
    }
  }

  // Fallback if publicId not present or cloudinary.url fails
  if (fileUrl && fileUrl.includes('/upload/')) {
    return fileUrl.replace('/upload/', `/upload/fl_attachment:${safeBaseName}/`);
  }

  return fileUrl || '';
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  generateDownloadUrl
};
