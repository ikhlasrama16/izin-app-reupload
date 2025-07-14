const router = require("express").Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const ctrl = require("../controller/izinController");

// Semua route di sini khusus USER BIASA
router.use(protect, authorize("user"));

// POST /api/izin → ajukan izin baru
router.post("/", ctrl.createIzin);

// GET /api/izin → lihat semua izin milik user
router.get("/", ctrl.getMyIzin);

// PATCH /api/izin/:id → edit izin
router.patch("/:id", ctrl.updateIzin);

// DELETE /api/izin/:id → batalkan izin
router.delete("/:id", ctrl.cancelIzin);

router.delete("/:id/permanent", ctrl.deleteIzin);

module.exports = router;
