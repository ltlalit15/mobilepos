const express = require('express');
const router = express.Router();
const upload = require("../Middileware/Multer");
const { singleDataById } = require("../Controller/singlectrl");
const shopLogin = require('../Controller/shopLoginctrl');
const ApplyMiddleware = require('../Middileware/Auth');


router.get("/", singleDataById );


module.exports = router;
