const User = require('../models/User');

/**
 * Award +10 points to a user for an approved resource upload
 * @param {string|ObjectId} userId
 */
const awardUploadPoints = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { contributionPoints: 10 } });
  } catch (err) {
    console.error('Error awarding upload contribution points:', err.message);
  }
};

/**
 * Award +5 points to the resource owner every 10 downloads
 * @param {Object} resource - Mongoose Resource document
 */
const checkDownloadMilestone = async (resource) => {
  try {
    if (resource.downloadCount > 0 && resource.downloadCount % 10 === 0) {
      await User.findByIdAndUpdate(resource.uploadedBy, { $inc: { contributionPoints: 5 } });
    }
  } catch (err) {
    console.error('Error awarding download contribution points:', err.message);
  }
};

/**
 * Award +3 points to the resource owner every 5 ratings received
 * @param {string|ObjectId} resourceId
 * @param {string|ObjectId} uploaderId
 */
const checkRatingMilestone = async (resourceId, uploaderId) => {
  try {
    const Rating = require('../models/Rating');
    const ratingCount = await Rating.countDocuments({ resource: resourceId });
    if (ratingCount > 0 && ratingCount % 5 === 0) {
      await User.findByIdAndUpdate(uploaderId, { $inc: { contributionPoints: 3 } });
    }
  } catch (err) {
    console.error('Error awarding rating contribution points:', err.message);
  }
};

module.exports = {
  awardUploadPoints,
  checkDownloadMilestone,
  checkRatingMilestone
};
