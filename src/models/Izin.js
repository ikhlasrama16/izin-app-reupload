const mongoose = require("mongoose");

const izinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jenis: {
      type: String,
      enum: ["cuti", "sakit", "libur"],
      required: true,
    },
    tanggalMulai: {
      type: Date,
      required: true,
    },
    tanggalSelesai: {
      type: Date,
      required: true,
    },
    keterangan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "accepted", "rejected", "revised", "resubmitted"],
      default: "submitted",
    },

    komentarVerifikator: {
      type: String,
      default: "",
    },
    dibatalkan: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Izin", izinSchema);
