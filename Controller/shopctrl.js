const Product = require("../Model/shopmodel");
const bcrypt = require('bcryptjs');
const upload = require("../Middileware/Multer");
const Shop = require("../Model/shopmodel");
require('dotenv').config();


const createShop = async (req, res) => {
    console.log(req.body);
    
    const { name, email, password, phone, address, post_code, city, state, country } = req.body;
  
    if (!name || !email || !password || !phone || !address || !post_code || !city || !state || !country) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
  
    try {
      const existingShop = await Shop.findOne({ email });
      if (existingShop) {
        return res.status(400).json({ message: "Shop already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new shop
      const shop = new Shop({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        post_code,
        city,
        state,
        country
      });
  
      const data = await shop.save();
  
      if (data) {
        return res.status(200).json({ 
          message: "Shop added successfully",
          success: true, 
          shop: data 
        });
      } else {
        return res.status(400).json({ message: "Shop creation failed" });
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };


  // ✅ 1. Get All Shops
const getAllShops = async (req, res) => {
    try {
      const shops = await Shop.find();
      res.status(200).json({ success: true, shops });
    } catch (error) {
      res.status(500).json({ message: "Error fetching shops", error: error.message });
    }
  };
  
  //  Get Shop By ID
  const getShopById = async (req, res) => {
    try {
      const shop = await Shop.findById(req.params.id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.status(200).json({ success: true, shop });
    } catch (error) {
      res.status(500).json({ message: "Error fetching shop", error: error.message });
    }
  };
  
  // ✅ 3. Edit/Update Shop
  const editShop = async (req, res) => {
    try {
      const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  
      if (!updatedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      res.status(200).json({ success: true, message: "Shop updated successfully", shop: updatedShop });
    } catch (error) {
      res.status(500).json({ message: "Error updating shop", error: error.message });
    }
  };

  
  
  // ✅ 4. Delete Shop By ID
  const deleteShopById = async (req, res) => {
    try {
      const deletedShop = await Shop.findByIdAndDelete(req.params.id);
      if (!deletedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.status(200).json({ success: true, message: "Shop deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting shop", error: error.message });
    }
  };




module.exports = { createShop, getAllShops, getShopById, editShop,  deleteShopById };


