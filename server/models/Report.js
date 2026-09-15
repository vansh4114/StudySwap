const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ReportedBy user ID is required']
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource reference is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for report is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'RESOLVED', 'DISMISSED'],
        message: '{VALUE} is not a valid report status'
      },
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1 });
reportSchema.index({ resource: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
