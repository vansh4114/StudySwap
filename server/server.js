const dotenv = require('dotenv');
const connectDB = require('./config/database');
const app = require('./app');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('Initial MongoDB connection error:', err.message);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
