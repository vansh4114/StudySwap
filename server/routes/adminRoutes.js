const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminResources,
  updateResourceStatus,
  adminDeleteResource,
  getAdminReports,
  updateReportStatus,
  getAdminUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Enforce authentication AND ADMIN authorization for all admin endpoints
router.use(protect);
router.use(authorize('ADMIN'));

// Stats endpoint
router.get('/stats', getAdminStats);

// Resource moderation endpoints
router.get('/resources', getAdminResources);
router.patch('/resources/:id/status', updateResourceStatus);
router.delete('/resources/:id', adminDeleteResource);

// Report management endpoints
router.get('/reports', getAdminReports);
router.patch('/reports/:id/status', updateReportStatus);

// User management endpoints
router.get('/users', getAdminUsers);

module.exports = router;
