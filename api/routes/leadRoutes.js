const express = require("express");
const router = express.Router();
const { createLead, getLeads,deleteLead,replyLead } = require("../controllers/leadController");

router.post('/leads', createLead);
router.get('/leads', getLeads);


module.exports = router;
