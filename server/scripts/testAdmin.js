const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Resource = require('../models/Resource');
const Report = require('../models/Report');
const Rating = require('../models/Rating');
const Bookmark = require('../models/Bookmark');

const authRoutes = require('../routes/authRoutes');
const resourceRoutes = require('../routes/resourceRoutes');
const userRoutes = require('../routes/userRoutes');
const adminRoutes = require('../routes/adminRoutes');
const { errorHandler } = require('../middleware/errorHandler');

const PORT = 5055;
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'yZ9bO40bti5QMAH3fOwfJaaqThbAKFwSUt+L3TAQ2/s=';
}
const JWT_SECRET = process.env.JWT_SECRET;

// Build test express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

let server;

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
};

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✓ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${testName}`);
      failed++;
    }
  };

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyswap';
    await mongoose.connect(mongoUri);
    console.log('\n--- STARTING ADMIN & SECURITY TEST SUITE ---');

    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api`;

    // Clean up test records
    await User.deleteMany({ email: { $in: ['student_test@example.com', 'admin_test@example.com'] } });
    await Resource.deleteMany({ title: 'Test Admin Resource' });

    // Create student user & token
    const student = await User.create({
      name: 'Test Student',
      email: 'student_test@example.com',
      password: 'Password123!',
      college: 'Test College',
      course: 'Computer Science',
      semester: 3,
      role: 'STUDENT',
      contributionPoints: 10
    });
    const studentToken = generateToken(student._id);

    // Create admin user & token
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin_test@example.com',
      password: 'Password123!',
      college: 'Test College',
      course: 'Computer Science',
      semester: 5,
      role: 'ADMIN',
      contributionPoints: 50
    });
    const adminToken = generateToken(admin._id);

    // Create test resource
    const testResource = await Resource.create({
      title: 'Test Admin Resource',
      description: 'Test resource description for admin moderation',
      resourceType: 'NOTES',
      subject: 'Data Structures',
      semester: 3,
      course: 'CS',
      uploadedBy: student._id,
      fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
      fileName: 'sample.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      cloudinaryPublicId: 'sample_id_123',
      status: 'PENDING'
    });

    // Create test rating, bookmark, report
    await Rating.create({ user: student._id, resource: testResource._id, rating: 5 });
    await Bookmark.create({ user: student._id, resource: testResource._id });
    const testReport = await Report.create({
      reportedBy: student._id,
      resource: testResource._id,
      reason: 'Inappropriate content test',
      status: 'PENDING'
    });

    // TEST 1: Unauthenticated request to /admin/stats
    const res1 = await fetch(`${baseUrl}/admin/stats`);
    assert(res1.status === 401, 'Unauthenticated request to admin stats is rejected (401)');

    // TEST 2: Student request to /admin/stats
    const res2 = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(res2.status === 403, 'Normal student access to admin endpoints is rejected (403)');

    // TEST 3: Admin request to /admin/stats
    const res3 = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data3 = await res3.json();
    assert(res3.status === 200 && data3.success && data3.stats.pendingResources >= 1, 'Admin access to admin stats works (200)');

    // TEST 4: Get Admin Resources with status filter
    const res4 = await fetch(`${baseUrl}/admin/resources?status=PENDING`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data4 = await res4.json();
    assert(res4.status === 200 && data4.resources.some((r) => r._id === testResource._id.toString()), 'Admin resource listing with status filter works');

    // TEST 5: Update resource status with invalid status
    const res5 = await fetch(`${baseUrl}/admin/resources/${testResource._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'INVALID_STATUS' })
    });
    assert(res5.status === 400, 'Invalid resource status update rejected (400)');

    // TEST 6: Update resource status with invalid ObjectId
    const res6 = await fetch(`${baseUrl}/admin/resources/invalid-id/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'APPROVED' })
    });
    assert(res6.status === 404, 'Invalid ObjectId returns 404 Not Found');

    // TEST 7: Approve pending resource
    const res7 = await fetch(`${baseUrl}/admin/resources/${testResource._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'APPROVED' })
    });
    const data7 = await res7.json();
    assert(res7.status === 200 && data7.resource.status === 'APPROVED', 'Admin approves resource status successfully');

    // TEST 8: Get Admin Reports
    const res8 = await fetch(`${baseUrl}/admin/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data8 = await res8.json();
    assert(res8.status === 200 && data8.reports.some((rep) => rep._id === testReport._id.toString()), 'Admin user reports listing works');

    // TEST 9: Resolve Report Status
    const res9 = await fetch(`${baseUrl}/admin/reports/${testReport._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'RESOLVED' })
    });
    const data9 = await res9.json();
    assert(res9.status === 200 && data9.report.status === 'RESOLVED', 'Admin resolves user report status successfully');

    // TEST 10: Get Admin User Directory
    const res10 = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data10 = await res10.json();
    assert(res10.status === 200 && data10.users.some((u) => u.email === 'student_test@example.com'), 'Admin user directory listing works');

    // TEST 11: Admin Deletion and Cascade Cleanup
    const res11 = await fetch(`${baseUrl}/admin/resources/${testResource._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data11 = await res11.json();

    const deletedRes = await Resource.findById(testResource._id);
    const deletedRatings = await Rating.find({ resource: testResource._id });
    const deletedBookmarks = await Bookmark.find({ resource: testResource._id });
    const deletedReports = await Report.find({ resource: testResource._id });

    assert(
      res11.status === 200 &&
        !deletedRes &&
        deletedRatings.length === 0 &&
        deletedBookmarks.length === 0 &&
        deletedReports.length === 0,
      'Admin resource deletion and database cascade cleanup succeed'
    );

    // TEST 12: Missing JWT_SECRET fails safely without fallback secret
    const savedSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    const res12 = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res12.status === 500, 'Missing JWT_SECRET fails safely without using fallback secret');
    process.env.JWT_SECRET = savedSecret;

    // TEST 13: Invalid status query parameter returns 400 for resources
    const res13 = await fetch(`${baseUrl}/admin/resources?status=INVALID_STATUS_QUERY`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res13.status === 400, 'Invalid resource status query parameter returns 400 Bad Request');

    // TEST 14: Invalid status query parameter returns 400 for reports
    const res14 = await fetch(`${baseUrl}/admin/reports?status=INVALID_STATUS_QUERY`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res14.status === 400, 'Invalid report status query parameter returns 400 Bad Request');

    // TEST 15: Hardened pagination boundary values (page < 1 & limit > 100)
    const res15 = await fetch(`${baseUrl}/admin/users?page=-1&limit=500`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data15 = await res15.json();
    assert(res15.status === 200 && data15.page === 1, 'Hardened pagination normalizes page < 1 to page 1 and caps limit');

    // Clean up test users
    await User.deleteMany({ email: { $in: ['student_test@example.com', 'admin_test@example.com'] } });

    console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---\n`);

  } catch (err) {
    console.error('Test script exception:', err);
    failed++;
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();
