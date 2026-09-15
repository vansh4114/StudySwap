const path = require('path');
const Resource = require('../models/Resource');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { createResourceSchema } = require('../validators/resourceValidator');

// @desc    Upload a new study resource
// @route   POST /api/resources
// @access  Private (Authenticated users)
const createResource = async (req, res, next) => {
  let cloudinaryResult = null;

  try {
    // 1. Check if file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resource file'
      });
    }

    // 2. Validate text fields using Zod
    const validation = createResourceSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue.message
      });
    }

    const {
      title,
      description,
      resourceType,
      subject,
      semester,
      course,
      university,
      tags
    } = validation.data;

    // 3. Process tags
    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter((t) => t.length > 0);
    }

    // 4. Upload file buffer to Cloudinary
    try {
      cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to cloud storage. Please check Cloudinary configuration.'
      });
    }

    // 5. Create Resource document in MongoDB
    try {
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');

      const resource = await Resource.create({
        title,
        description,
        resourceType,
        subject,
        semester,
        course,
        university: university || '',
        uploadedBy: req.user._id, // Enforced from authenticated token
        fileUrl: cloudinaryResult.secure_url,
        fileName: req.file.originalname,
        fileType: ext || req.file.mimetype,
        fileSize: req.file.size,
        cloudinaryPublicId: cloudinaryResult.public_id,
        tags: parsedTags,
        downloadCount: 0,
        viewCount: 0,
        averageRating: 0,
        status: 'APPROVED'
      });

      return res.status(201).json({
        success: true,
        message: 'Resource uploaded successfully',
        resource
      });
    } catch (dbError) {
      // Clean up Cloudinary asset if MongoDB save fails to avoid orphaned files
      if (cloudinaryResult && cloudinaryResult.public_id) {
        await deleteFromCloudinary(cloudinaryResult.public_id);
      }
      return next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource
};
