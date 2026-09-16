const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Error: Please provide a user email address.');
  console.log('Usage: node scripts/makeAdmin.js <user-email>');
  process.exit(1);
}

const promoteToAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI environment variable is required.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`User with email '${email}' not found.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    user.role = 'ADMIN';
    await user.save();

    console.log(`Success: User '${user.name}' (${user.email}) promoted to ADMIN role.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

promoteToAdmin();
