const express = require("express");
const router = express.Router();
const { createLead, getLeads, deleteLead } = require("../controllers/leadController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/leads", createLead);
router.get("/leads", verifyToken, getLeads);
router.delete("/leads/:id", verifyToken, deleteLead);

module.exports = router;
