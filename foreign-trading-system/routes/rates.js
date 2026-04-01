const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/ratesController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, ctrl.getRates);
router.get("/api", ctrl.getApiRates);

module.exports = router;
