const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { createbrand, getbrand, singlebrand, deletebrand, Updatebrand } = require('../Controller/brandctrl');

// API routes for products
router.post("/", createbrand);
router.get("/", getbrand);
router.get("/:id", singlebrand);
router.delete("/:id", deletebrand);
router.patch("/:id", Updatebrand);

module.exports = router;
