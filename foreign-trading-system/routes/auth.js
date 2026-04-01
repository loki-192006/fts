const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const { isGuest } = require("../middleware/auth");

router.get("/register", isGuest, ctrl.getRegister);
router.post("/register", isGuest, ctrl.postRegister);
router.get("/login", isGuest, ctrl.getLogin);
router.post("/login", isGuest, ctrl.postLogin);
router.get("/logout", ctrl.logout);

module.exports = router;
