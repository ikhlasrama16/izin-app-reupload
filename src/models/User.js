const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {                    // <–– admin | verifikator | user
    type: String,
    enum: ['admin', 'verifikator', 'user'],
    default: 'user'
  },
  isVerified: {              // khusus verifikator untuk validasi user
    type: Boolean,
    default: false
  }
});

// hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
