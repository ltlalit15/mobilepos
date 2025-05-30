const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { getInvoiceReportAmount } = require('../Controller/invoicectrl.js');

router.get("/", getInvoiceReportAmount);


module.exports = router;