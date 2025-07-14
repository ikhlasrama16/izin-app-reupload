const User = require("../models/User");
const Izin = require("../models/Izin");

/* GET daftar user dengan filter verifikasi */
exports.listUserRegistrations = async (req, res) => {
  const { verified } = req.query;

  const filter = { role: "user" };

  if (verified === "true") filter.isVerified = true;
  else if (verified === "false") filter.isVerified = false;

  const users = await User.find(filter).select("-password");
  res.json(users);
};

/* PATCH /api/verifikator/users/:id/verify — set isVerified */
exports.verifyUser = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // true | false
  const user = await User.findByIdAndUpdate(
    id,
    { isVerified: status },
    { new: true }
  ).select("-password");
  res.json(user);
};

// 🔍 Lihat izin berdasarkan status (query param)
exports.listIzin = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (status !== "rejected") filter.dibatalkan = false;

    const izins = await Izin.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(izins);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil daftar izin", error: err.message });
  }
};

// ✏️ Proses izin (verifikator action)
exports.processIzin = async (req, res) => {
  try {
    const { status, komentar } = req.body;

    const izin = await Izin.findById(req.params.id);
    if (!izin) return res.status(404).json({ message: "Izin tidak ditemukan" });

    if (!["accepted", "rejected", "revised"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    // Jangan bisa diproses dua kali
    if (["accepted", "rejected"].includes(izin.status)) {
      return res.status(400).json({ message: "Izin sudah diproses" });
    }

    izin.status = status;
    izin.komentarVerifikator = komentar || "";
    await izin.save();

    res.json({ message: "Izin berhasil diperbarui", izin });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal memproses izin", error: err.message });
  }
};
