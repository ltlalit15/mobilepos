const express = require('express');
const router = express.Router();
const { createSummary, getAllSummary, getSummaryById, deleteSummary, updateSummary  } = require("../Controller/summaryctrl");
const upload = require("../Middileware/Multer");
const ApplyMiddleware = require('../Middileware/Auth');

// API routes for summary
router.post("/", createSummary);
router.get("/",  getAllSummary);
router.get("/:id",  getSummaryById);
router.delete("/:id",deleteSummary);
//router.get("/dashboardSummary", dashboardSummary);
router.patch("/:id", updateSummary);
//router.get("/getProductSalesReport", getProductSalesReport);


module.exports = router;
