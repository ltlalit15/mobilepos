const express = require('express');
const router = express.Router();
const ApplyMiddleware = require('../Middileware/Auth');
const { createcategory, getcategory, singlecategory, deletecategory, Updatecategory } = require('../Controller/categoryctrl');
const upload = require("../Middileware/Multer");
// API routes for products
router.post("/", upload.single('p_image'),createcategory);
router.get("/",   getcategory);
router.get("/:id",   singlecategory);
router.delete("/:id",deletecategory);
router.patch("/:id", ApplyMiddleware,Updatecategory);

module.exports = router;
