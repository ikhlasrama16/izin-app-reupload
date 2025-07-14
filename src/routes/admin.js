const router = require("express").Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const ctrl = require("../controller/adminController");

// admin route only
router.use(protect, authorize("admin"));

router.get("/users", ctrl.listUser);
router.post("/verifikator", ctrl.createVerifikator);
router.patch("/users/:id/role", ctrl.changeRole);
router.patch("/users/:id/password", ctrl.resetPassword);
router.get("/izin", ctrl.listAllIzin);

module.exports = router;
