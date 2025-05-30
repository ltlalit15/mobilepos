const express = require('express');
const router = express.Router();
const upload = require("../Middileware/Multer");
const { createShop, getAllShops, getShopById, editShop, deleteShopById } = require("../Controller/shopctrl");
const shopLogin = require('../Controller/shopLoginctrl');
const ApplyMiddleware = require('../Middileware/Auth');




// API routes for shop
router.post("/", createShop);
router.get("/", getAllShops);
router.get("/:id", getShopById);
router.patch("/:id", editShop);
router.delete("/:id", deleteShopById);


//shop login  route
router.post("/shopLogin",shopLogin)
module.exports = router;


