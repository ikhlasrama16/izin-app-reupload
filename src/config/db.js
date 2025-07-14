const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB Error:', err.message);
    process.exit(1); // stop server kalau gagal connect DB
  }
};

module.exports = connectDB;
