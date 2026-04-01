const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tradeController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, ctrl.getTrade);
router.post("/execute", isAuthenticated, ctrl.executeTrade);

module.exports = router;
