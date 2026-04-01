const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/dashboard", isAuthenticated, isAdmin, ctrl.getDashboard);
router.get("/users", isAuthenticated, isAdmin, ctrl.getUsers);
router.post("/users/:id/toggle", isAuthenticated, isAdmin, ctrl.toggleUser);
router.get("/transactions", isAuthenticated, isAdmin, ctrl.getTransactions);
router.get("/rates", isAuthenticated, isAdmin, ctrl.getRates);
router.post("/rates/:id/update", isAuthenticated, isAdmin, ctrl.updateRate);

module.exports = router;
