const Bookmark = require('../models/Bookmark');

// @desc    Get user's bookmarked resources
// @route   GET /api/users/me/bookmarks
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'resource',
        populate: {
          path: 'uploadedBy',
          select: 'name email college course profileImage contributionPoints role'
        }
      })
      .sort({ createdAt: -1 });

    // Extract populated resource objects
    const bookmarkedResources = bookmarks
      .filter((b) => b.resource !== null)
      .map((b) => ({
        bookmarkId: b._id,
        bookmarkedAt: b.createdAt,
        resource: b.resource
      }));

    return res.status(200).json({
      success: true,
      count: bookmarkedResources.length,
      bookmarks: bookmarkedResources
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookmarks
};
