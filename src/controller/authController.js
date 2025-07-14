const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

// Generate token
function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

/* REGISTER — default role = user */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email exists" });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      user: { id: user._id, name, email, role: user.role },
      token: user,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });
  res.json({
    user: { id: user._id, name: user.name, email, role: user.role },
    token: generateToken(user),
  });
};

// ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Password lama salah" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password berhasil diubah" });
};
