const express = require("express");
const router = express.Router();
const { forgetPassword, resetPassword, updatePassword } = require("../Controller/emailctrl");

// ✅ Create Device
router.post("/forgetPassword", forgetPassword);  // ✅ Create Device

router.post("/resetPassword", resetPassword);

router.post("/updatePassword", updatePassword);

module.exports = router;
