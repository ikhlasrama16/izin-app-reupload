const User = require("../models/User");
const Izin = require("../models/Izin");
const bcrypt = require("bcrypt");

/* GET /api/admin/users?role=user&verified=true|false */
exports.listUser = async (req, res) => {
  const { role, verified } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (verified !== undefined) filter.isVerified = verified === "true";
  const users = await User.find(filter).select("-password");
  res.json(users);
};

/* POST /api/admin/verifikator — tambah user verifikator */
exports.createVerifikator = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email exist" });
  const ver = await User.create({
    name,
    email,
    password,
    role: "verifikator",
    isVerified: true,
  });
  res
    .status(201)
    .json({
      id: ver._id,
      email: ver.email,
      message: "verifikator created successfully",
    });
};

/* PATCH /api/admin/users/:id/role — ubah user biasa jadi verifikator, dll */
exports.changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // 'verifikator' | 'user' | 'admin'
  const updated = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select("-password");
  res.json(updated);
};

/* PATCH /api/admin/users/:id/password — reset password user */
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const hash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(id, { password: hash });
  res.json({ message: "Password reset" });
};

exports.listAllIzin = async (req, res) => {
  try {
    const izins = await Izin.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(izins);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data izin", error: err.message });
  }
};
