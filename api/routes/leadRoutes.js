const express = require("express");
const router = express.Router();
const { createLead, getLeads } = require("../controllers/leadController");

router.post("/leads", createLead);
router.get("/leads", getLeads);
router.delete("/leads/:id", deleteLead);
router.post("/leads/:id/reply", replyLead);

module.exports = router;
