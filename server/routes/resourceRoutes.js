const express = require('express');
const router = express.Router();
const { createResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { handleSingleUpload } = require('../middleware/uploadMiddleware');

router.post('/', protect, handleSingleUpload('file'), createResource);

module.exports = router;
