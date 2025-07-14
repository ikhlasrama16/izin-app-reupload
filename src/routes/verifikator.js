const router = require("express").Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const ctrl = require("../controller/verifikatorController");

router.use(protect, authorize("verifikator"));

router.get("/users", ctrl.listUserRegistrations);
router.patch("/users/:id/verify", ctrl.verifyUser);

router.get("/izin", ctrl.listIzin);
router.patch("/izin/:id", ctrl.processIzin);

module.exports = router;
