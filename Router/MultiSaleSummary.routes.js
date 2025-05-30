const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { getMultiSaleSummary } = require('../Controller/summaryctrl.js');

router.get("/", getMultiSaleSummary);




module.exports = router;