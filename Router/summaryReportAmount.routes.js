const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { getSummaryReportAmount } = require('../Controller/summaryctrl.js');

router.get("/", getSummaryReportAmount);


module.exports = router;