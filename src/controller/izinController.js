const Izin = require("../models/Izin");
const User = require("../models/User");

exports.createIzin = async (req, res) => {
  const { jenis, tanggalMulai, tanggalSelesai, keterangan } = req.body;

  try {
    // Validasi tanggal
    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      return res.status(400).json({
        message: "Tanggal mulai tidak boleh lebih besar dari tanggal selesai",
      });
    }

    // Ambil data user dari DB
    const user = await User.findById(req.user.id);

    // Cek apakah sudah diverifikasi
    if (!user || !user.isVerified) {
      return res.status(403).json({
        message: "Akun Anda belum diverifikasi dan tidak dapat mengajukan izin",
      });
    }

    // Buat izin
    const izin = await Izin.create({
      user: req.user.id,
      jenis,
      tanggalMulai,
      tanggalSelesai,
      keterangan,
    });

    res.status(201).json(izin);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengajukan izin", error: err.message });
  }
};
// lihat izin milik user yang login
exports.getMyIzin = async (req, res) => {
  const izins = await Izin.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(izins);
};

// Update izin (hanya jika status masih "submitted" atau "revised")
exports.updateIzin = async (req, res) => {
  const izin = await Izin.findById(req.params.id);

  if (!izin) return res.status(404).json({ message: "Izin tidak ditemukan" });
  if (izin.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Bukan izin milik Anda" });
  if (!["submitted", "revised"].includes(izin.status))
    return res
      .status(400)
      .json({ message: "Izin tidak bisa diubah karena sudah diproses" });

  const { jenis, tanggalMulai, tanggalSelesai, keterangan } = req.body;

  izin.jenis = jenis || izin.jenis;
  izin.tanggalMulai = tanggalMulai || izin.tanggalMulai;
  izin.tanggalSelesai = tanggalSelesai || izin.tanggalSelesai;
  izin.keterangan = keterangan || izin.keterangan;

  // ✅ Jika sebelumnya direvisi, ubah status menjadi resubmitted
  if (izin.status === "revised") {
    izin.status = "resubmitted";
    izin.komentarVerifikator = ""; // Kosongkan komentar sebelumnya
  }

  await izin.save();
  res.json(izin);
};

// Batalkan / Hapus izin (hanya jika belum diproses)
exports.cancelIzin = async (req, res) => {
  const izin = await Izin.findById(req.params.id);

  if (!izin) return res.status(404).json({ message: "Izin tidak ditemukan" });
  if (izin.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Bukan izin milik Anda" });
  if (!["submitted", "revised"].includes(izin.status))
    return res
      .status(400)
      .json({ message: "Izin tidak bisa dibatalkan karena sudah diproses" });

  izin.dibatalkan = true;
  izin.status = "cancelled";

  await izin.save();
  res.json({ message: "Izin berhasil dibatalkan", izin });
};

// Hapus izin permanen (hanya jika milik user & belum diproses)
exports.deleteIzin = async (req, res) => {
  const izin = await Izin.findById(req.params.id);

  if (!izin) return res.status(404).json({ message: "Izin tidak ditemukan" });
  if (izin.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Bukan izin milik Anda" });

  // Kalau sudah diproses, tidak bisa dihapus
  if (!["submitted", "revised", "resubmitted"].includes(izin.status)) {
    return res
      .status(400)
      .json({ message: "Izin tidak bisa dihapus karena sudah diproses" });
  }

  await izin.deleteOne();
  res.json({ message: "Izin berhasil dihapus" });
};
