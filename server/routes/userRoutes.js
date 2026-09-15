const express = require('express');
const router = express.Router();
const { getUserBookmarks } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/bookmarks', protect, getUserBookmarks);

module.exports = router;
