const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { getSoldQuantityReport } = require('../Controller/summaryctrl.js');

router.get("/", getSoldQuantityReport);




module.exports = router;