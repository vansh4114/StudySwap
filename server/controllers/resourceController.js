const path = require('path');
const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const Rating = require('../models/Rating');
const Bookmark = require('../models/Bookmark');
const Report = require('../models/Report');
const { uploadToCloudinary, deleteFromCloudinary, generateDownloadUrl } = require('../config/cloudinary');
const { createResourceSchema, ratingSchema, reportSchema } = require('../validators/resourceValidator');
const {
  awardUploadPoints,
  checkDownloadMilestone,
  checkRatingMilestone
} = require('../utils/contributionPoints');

// Helper to check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Safe user fields projection
const SAFE_USER_FIELDS = 'name email college course profileImage contributionPoints role';

// Helper to recalculate average rating for a resource
const recalculateAverageRating = async (resourceId) => {
  const stats = await Rating.aggregate([
    { $match: { resource: new mongoose.Types.ObjectId(resourceId) } },
    { $group: { _id: '$resource', avgRating: { $avg: '$rating' } } }
  ]);

  const newAvg = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  await Resource.findByIdAndUpdate(resourceId, { averageRating: newAvg });
  return newAvg;
};

// @desc    Upload a new study resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res, next) => {
  let cloudinaryResult = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resource file'
      });
    }

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

    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter((t) => t.length > 0);
    }

    try {
      cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to cloud storage'
      });
    }

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
        uploadedBy: req.user._id,
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

      // Award +10 contribution points for uploading
      await awardUploadPoints(req.user._id);

      return res.status(201).json({
        success: true,
        message: 'Resource uploaded successfully',
        resource
      });
    } catch (dbError) {
      if (cloudinaryResult && cloudinaryResult.public_id) {
        await deleteFromCloudinary(cloudinaryResult.public_id);
      }
      return next(dbError);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resources (with search, filter, pagination)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    // Search functionality (q) across title, description, subject, tags
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Filter fields
    if (req.query.resourceType) {
      query.resourceType = req.query.resourceType.toUpperCase();
    }
    if (req.query.subject) {
      query.subject = new RegExp(`^${req.query.subject.trim()}$`, 'i');
    }
    if (req.query.semester) {
      const sem = parseInt(req.query.semester, 10);
      if (!isNaN(sem)) query.semester = sem;
    }
    if (req.query.course) {
      query.course = new RegExp(`^${req.query.course.trim()}$`, 'i');
    }
    if (req.query.university) {
      query.university = new RegExp(req.query.university.trim(), 'i');
    }

    const total = await Resource.countDocuments(query);

    const resources = await Resource.find(query)
      .populate('uploadedBy', SAFE_USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page,
      totalPages,
      resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by ID & increment viewCount
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('uploadedBy', SAFE_USER_FIELDS);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    return res.status(200).json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request resource download & increment downloadCount
// @route   GET /api/resources/:id/download
// @access  Public
const downloadResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if download milestone is reached (+5 contribution points to uploader)
    await checkDownloadMilestone(resource);

    // Generate attachment URL for download
    const downloadUrl = generateDownloadUrl(resource);

    // Return download metadata and file URL
    return res.status(200).json({
      success: true,
      message: 'Download requested successfully',
      downloadUrl,
      fileName: resource.fileName,
      downloadCount: resource.downloadCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a resource (1-5)
// @route   POST /api/resources/:id/rating
// @access  Private
const rateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const validation = ratingSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue.message
      });
    }

    const { rating } = validation.data;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Upsert rating (Create or update existing user rating)
    await Rating.findOneAndUpdate(
      { user: req.user._id, resource: id },
      { rating },
      { upsert: true, new: true, runValidators: true }
    );

    // Recalculate average rating
    const averageRating = await recalculateAverageRating(id);

    // Check rating milestone for resource uploader (+3 contribution points)
    await checkRatingMilestone(id, resource.uploadedBy);

    return res.status(200).json({
      success: true,
      message: 'Rating saved successfully',
      averageRating
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user rating for a resource
// @route   DELETE /api/resources/:id/rating
// @access  Private
const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const existingRating = await Rating.findOneAndDelete({
      user: req.user._id,
      resource: id
    });

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found for this resource'
      });
    }

    const averageRating = await recalculateAverageRating(id);

    return res.status(200).json({
      success: true,
      message: 'Rating removed successfully',
      averageRating
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark a resource
// @route   POST /api/resources/:id/bookmark
// @access  Private
const bookmarkResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      resource: id
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Resource is already bookmarked'
      });
    }

    await Bookmark.create({
      user: req.user._id,
      resource: id
    });

    return res.status(201).json({
      success: true,
      message: 'Resource bookmarked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark from a resource
// @route   DELETE /api/resources/:id/bookmark
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      resource: id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report a resource
// @route   POST /api/resources/:id/report
// @access  Private
const reportResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const validation = reportSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue.message
      });
    }

    const { reason } = validation.data;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Prevent duplicate pending reports from the same user for this resource
    const existingReport = await Report.findOne({
      reportedBy: req.user._id,
      resource: id,
      status: 'PENDING'
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a pending report for this resource'
      });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      resource: id,
      reason,
      status: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      message: 'Resource reported successfully',
      report
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to clean up Cloudinary asset and delete associated ratings, bookmarks, reports
const deleteResourceCascade = async (resource) => {
  if (resource.cloudinaryPublicId) {
    await deleteFromCloudinary(resource.cloudinaryPublicId);
  }

  await Resource.findByIdAndDelete(resource._id);
  await Rating.deleteMany({ resource: resource._id });
  await Bookmark.deleteMany({ resource: resource._id });
  await Report.deleteMany({ resource: resource._id });
};

// @desc    Delete a resource (Owner or Admin only)
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Ownership check: must be resource owner OR admin
    const isOwner = resource.uploadedBy.equals(req.user._id);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource'
      });
    }

    await deleteResourceCascade(resource);

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  downloadResource,
  rateResource,
  deleteRating,
  bookmarkResource,
  removeBookmark,
  reportResource,
  deleteResource,
  deleteResourceCascade
};
