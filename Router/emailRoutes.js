const express = require("express");
const router = express.Router();
const { forgetPassword, resetPassword } = require("../Controller/emailctrl");

// ✅ Create Device
router.post("/forgetPassword", forgetPassword);  // ✅ Create Device

router.post("/resetPassword", resetPassword);

module.exports = router;
