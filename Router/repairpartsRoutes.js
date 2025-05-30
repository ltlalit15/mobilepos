const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { createRepairPart, getAllRepairParts, getRepairPartById, updateRepairPart, deleteRepairPart } = require('../Controller/repairpartsctrl');

// API routes for products
router.post("/", createRepairPart);
router.get("/", getAllRepairParts);
router.get("/:id", getRepairPartById);
router.patch("/:id", updateRepairPart);
router.delete("/:id", deleteRepairPart);

module.exports = router;