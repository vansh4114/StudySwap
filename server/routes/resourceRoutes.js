const express = require('express');
const router = express.Router();
const {
  createResource,
  getResources,
  getResourceById,
  downloadResource,
  rateResource,
  deleteRating,
  bookmarkResource,
  removeBookmark,
  reportResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { handleSingleUpload } = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getResources);
router.get('/:id', getResourceById);
router.get('/:id/download', downloadResource);

// Protected endpoints
router.post('/', protect, handleSingleUpload('file'), createResource);
router.delete('/:id', protect, deleteResource);

// Rating endpoints
router.post('/:id/rating', protect, rateResource);
router.delete('/:id/rating', protect, deleteRating);

// Bookmark endpoints
router.post('/:id/bookmark', protect, bookmarkResource);
router.delete('/:id/bookmark', protect, removeBookmark);

// Report endpoint
router.post('/:id/report', protect, reportResource);

module.exports = router;
