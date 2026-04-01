const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, ctrl.getDashboard);
router.get("/portfolio", isAuthenticated, ctrl.getPortfolio);
router.get("/transactions", isAuthenticated, ctrl.getTransactions);

module.exports = router;
