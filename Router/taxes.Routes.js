const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const {createTax,
    getAllTaxes,
    getTaxById,
    updateTax,
    deleteTax, } = require('../Controller/taxes.controller.js');

// API routes for products
router.post("/", createTax);       // Create a tax
router.get("/", getAllTaxes);       // Get all taxes
router.get("/:id", getTaxById);    // Get tax by ID
router.put("/:id", updateTax);     // Update tax by ID
router.delete("/:id", deleteTax);  // Delete tax by ID

module.exports = router;