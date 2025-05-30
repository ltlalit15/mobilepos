const express = require('express');
const router = express.Router();
const { createproduct, getproduct, singleproduct, deleteproduct, UpdateProduct  } = require("../Controller/productctrl");
const upload = require("../Middileware/Multer");
const ApplyMiddleware = require('../Middileware/Auth');

// API routes for products
router.post("/", upload.array('images', 10), createproduct);
router.get("/",   getproduct);
router.get("/:id",  singleproduct);
router.delete("/:id",deleteproduct);
router.patch("/:id", upload.array('images', 10), UpdateProduct);
//router.get("/getProductSalesReport", getProductSalesReport);


module.exports = router;
