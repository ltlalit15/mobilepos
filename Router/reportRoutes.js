const express = require('express');
const router = express.Router();
const upload = require("../Middileware/Multer");
const ApplyMiddleware = require('../Middileware/Auth');


const { getInvoiceReport  } = require("../Controller/reportctrl");


router.get("/",ApplyMiddleware, getInvoiceReport);





module.exports = router;