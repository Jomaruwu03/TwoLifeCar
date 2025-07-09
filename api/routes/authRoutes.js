const express = require("express");
const router = express.Router();
const { login, createAdmin } = require("../controllers/authController");

router.post("/login", login);
router.get("/create-admin", createAdmin); 


module.exports = router;
