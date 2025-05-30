const device= require('../Model/devicemodel')
const upload = require("../Middileware/Multer")


// ✅ Create Device
const createDevice = async (req, res) => {
  const { device_name, brandId, categoryId, shopId } = req.body;

  if (!device_name || !brandId || !categoryId ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newDevice = new device({
      device_name,
      brand: brandId,
      category: categoryId,
      shop: shopId
    });

    const data = await newDevice.save();

    if (data) {
      return res.status(200).json({ message: "Device created successfully", success: true, data });
    } else {
      return res.status(400).json({ message: "Device creation error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Devices
const getAllDevices = async (req, res) => {
  try {
    const response = await device.find({})
    .populate("brand", "brand_name") // ✅ Brand details
    .populate("category", "category_name") // ✅ Category details
    .populate("shop", "shop_name"); // ✅ Shop details (optional)
    
    if (response.length > 0) {
      return res.status(200).json({ message: "Devices fetched successfully", success: true, data: response });
    } else {
      return res.status(404).json({ message: "No devices found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Single Device
// const getSingleDevice = async (req, res) => {
//     try {
//       const response = await device.findOne({ _id: req.params.id })
//         .populate("brand", "brand_name") // ✅ Brand details
//         .populate("category", "category_name") // ✅ Category details
//         .populate("shop", "shop_name"); // ✅ Shop details
  
//       if (response) {
//         return res.status(200).json({ message: "Device fetched successfully", success: true, data: response });
//       } else {
//         return res.status(404).json({ message: "Device not found" });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
//   };

const getSingleDevice = async (req, res) => {
    const { deviceId, brandId, categoryId, shopId } = req.params; // ✅ Get all 4 IDs from request params
  
    try {
      const response = await device.findOne({ 
        _id: deviceId, 
        brand: brandId, 
        category: categoryId, 
        shop: shopId 
      })
      .populate("brand", "brand_name _id")
      .populate("category", "category_name _id")
      .populate("shop", "shop_name _id");
  
      if (response) {
        return res.status(200).json({ 
          message: "Device fetched successfully", 
          success: true, 
          data: {
            _id: response._id,
            device_name: response.device_name,
            brand: { _id: response.brand?._id, brand_name: response.brand?.brand_name },
            category: { _id: response.category?._id, category_name: response.category?.category_name },
            shop: { _id: response.shop?._id, shop_name: response.shop?.shop_name }
          }
        });
      } else {
        return res.status(404).json({ message: "Device not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
  
// ✅ Delete Device
const deleteDevice = async (req, res) => {
  try {
    const response = await device.findByIdAndDelete(req.params.id);

    if (response) {
      return res.status(200).json({ message: "Device deleted successfully", success: true });
    } else {
      return res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update Device
const updateDevice = async (req, res) => {
    const { id } = req.params;
    const { device_name, brandId, categoryId, shopId } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: "Device ID is required" });
    }
  
    const updateFields = {};
    if (device_name) updateFields.device_name = device_name;
    if (brandId) updateFields.brand = brandId;
    if (categoryId) updateFields.category = categoryId;
    if (shopId) updateFields.shop = shopId;
  
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }
  
    try {
      const updatedDevice = await device.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).populate("brand", "brand_name") // ✅ Populate brand
       .populate("category", "category_name") // ✅ Populate category
       .populate("shop", "shop_name"); // ✅ Populate shop
  
      if (updatedDevice) {
        return res.status(200).json({ message: "Device updated successfully", success: true, data: updatedDevice });
      } else {
        return res.status(404).json({ message: "Device not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
module.exports = { createDevice, getAllDevices, getSingleDevice, deleteDevice, updateDevice };
