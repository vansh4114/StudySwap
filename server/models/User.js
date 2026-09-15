const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    college: {
      type: String,
      trim: true,
      default: ''
    },
    course: {
      type: String,
      trim: true,
      default: ''
    },
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
      max: [10, 'Semester cannot exceed 10'],
      default: null
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['STUDENT', 'ADMIN'],
        message: '{VALUE} is not a valid role'
      },
      default: 'STUDENT'
    },
    contributionPoints: {
      type: Number,
      default: 0,
      min: [0, 'Contribution points cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
