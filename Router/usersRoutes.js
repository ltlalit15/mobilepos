const express = require('express');
const router = express.Router();
const { SignupCtrl, Deletedata, Singledata, updatedUser, SingledatabyId} = require("../Controller/Signupctrl");
const LoginCtrl = require('../Controller/Loginctrl');
const upload = require('../Middileware/Multer');

// API routes for users register
router.post("/", SignupCtrl);

router.get("/:sid", Singledata);
router.get("/", SingledatabyId);
router.patch("/:id", updatedUser);
router.delete("/:did", Deletedata);

//login  route
router.post("/login",LoginCtrl)
module.exports = router;
