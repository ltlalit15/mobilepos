const express = require('express');
const router = express.Router();
const { SignupCtrl, Getdata, Deletedata, Singledata, updatedUser, } = require("../Controller/Signupctrl");
const LoginCtrl = require('../Controller/Loginctrl');
const upload = require('../Middileware/Multer');

// API routes for users register
router.post("/", SignupCtrl);
router.get("/", Getdata);
router.get("/:sid", Singledata);
router.patch("/:id", updatedUser);
router.delete("/:did", Deletedata);

//login  route
router.post("/login",LoginCtrl)
module.exports = router;
