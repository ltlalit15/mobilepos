const express = require('express');
const router = express.Router();
const { getSalesReport  } = require("../Controller/productreportctrl");
const upload = require("../Middileware/Multer");
const ApplyMiddleware = require('../Middileware/Auth');

// API routes for products

router.get("/",  getSalesReport );




module.exports = router;
