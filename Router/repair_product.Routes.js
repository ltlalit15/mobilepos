const express = require("express");
const {  createRepairProduct,
    getAllRepairProducts,
    getRepairProductById, } = require("../Controller/repair_product.controller.js");

const router = express.Router();

router.post("/", createRepairProduct);
router.get("/", getAllRepairProducts);
router.get("/:id", getRepairProductById);

module.exports = router;
