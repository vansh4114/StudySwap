const mongoose = require('mongoose');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Report = require('../models/Report');
const Rating = require('../models/Rating');
const Bookmark = require('../models/Bookmark');
const { deleteFromCloudinary } = require('../config/cloudinary');
const { deleteResourceCascade } = require('./resourceController');

const SAFE_USER_FIELDS = 'name email college course profileImage contributionPoints role createdAt';

// Helper for hardened pagination (page >= 1, 1 <= limit <= 100)
const parsePagination = (queryPage, queryLimit) => {
  const p = parseInt(queryPage, 10);
  const page = isNaN(p) || p < 1 ? 1 : p;

  const l = parseInt(queryLimit, 10);
  const limit = isNaN(l) || l < 1 ? 10 : Math.min(l, 100);

  const startIndex = (page - 1) * limit;
  return { page, limit, startIndex };
};

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();
    const pendingResources = await Resource.countDocuments({ status: 'PENDING' });
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResources,
        pendingResources,
        pendingReports
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resources for admin moderation (with status filter & pagination)
// @route   GET /api/admin/resources
// @access  Private/Admin
const getAdminResources = async (req, res, next) => {
  try {
    const { page, limit, startIndex } = parsePagination(req.query.page, req.query.limit);

    const validResourceStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
    const query = {};
    if (req.query.status) {
      const upperStatus = String(req.query.status).toUpperCase();
      if (!validResourceStatuses.includes(upperStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Status filter must be one of APPROVED, REJECTED, PENDING'
        });
      }
      query.status = upperStatus;
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

// @desc    Update resource moderation status (APPROVED, REJECTED, PENDING)
// @route   PATCH /api/admin/resources/:id/status
// @access  Private/Admin
const updateResourceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
    if (!status || typeof status !== 'string' || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of APPROVED, REJECTED, PENDING'
      });
    }

    const resource = await Resource.findByIdAndUpdate(
      id,
      { status: status.toUpperCase() },
      { new: true, runValidators: true }
    ).populate('uploadedBy', SAFE_USER_FIELDS);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Resource status updated to ${resource.status}`,
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource by Admin
// @route   DELETE /api/admin/resources/:id
// @access  Private/Admin
const adminDeleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    await deleteResourceCascade(resource);

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully by admin'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports for admin moderation
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAdminReports = async (req, res, next) => {
  try {
    const { page, limit, startIndex } = parsePagination(req.query.page, req.query.limit);

    const validReportStatuses = ['PENDING', 'RESOLVED', 'DISMISSED'];
    const query = {};
    if (req.query.status) {
      const upperStatus = String(req.query.status).toUpperCase();
      if (!validReportStatuses.includes(upperStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Status filter must be one of PENDING, RESOLVED, DISMISSED'
        });
      }
      query.status = upperStatus;
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reportedBy', SAFE_USER_FIELDS)
      .populate('resource')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page,
      totalPages,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (RESOLVED, DISMISSED, PENDING)
// @route   PATCH /api/admin/reports/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const validStatuses = ['PENDING', 'RESOLVED', 'DISMISSED'];
    if (!status || typeof status !== 'string' || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of PENDING, RESOLVED, DISMISSED'
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status: status.toUpperCase() },
      { new: true, runValidators: true }
    )
      .populate('reportedBy', SAFE_USER_FIELDS)
      .populate('resource');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Report status updated to ${report.status}`,
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const { page, limit, startIndex } = parsePagination(req.query.page, req.query.limit);

    const total = await User.countDocuments();
    const users = await User.find()
      .select(SAFE_USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminResources,
  updateResourceStatus,
  adminDeleteResource,
  getAdminReports,
  updateReportStatus,
  getAdminUsers
};
