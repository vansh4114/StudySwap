const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: {
        values: ['NOTES', 'PYQ', 'ASSIGNMENT', 'BOOK', 'OTHER'],
        message: '{VALUE} is not a valid resource type'
      },
      default: 'NOTES'
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [10, 'Semester cannot exceed 10']
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true
    },
    university: {
      type: String,
      trim: true,
      default: ''
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required']
    },
    fileUrl: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: 0
    },
    cloudinaryPublicId: {
      type: String,
      default: ''
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid status'
      },
      default: 'APPROVED'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for search and query performance
resourceSchema.index({ subject: 1, course: 1, semester: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ status: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
