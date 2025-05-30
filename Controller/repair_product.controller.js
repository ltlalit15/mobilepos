const RepairProduct = require("../Model/repair_product.model.js");

// ✅ Create Repair Product
const createRepairProduct = async (req, res) => {
  try {
    const {
      name,
      warrantyType,
      warrantyPeriod,
      category,
      brand,
      description,
      problem,
      quantity,
      supplier,
      upccode,
      sku,
      // pricing,
      averagejobtime,
      status,
      repairprice,
      tax,
      images, // Expecting Base64 encoded image
    } = req.body;

    if (!name || !category || !brand) {
      return res.status(400).json({ message: "Name, Category, and Brand are required!" });
    }

    const newProduct = new RepairProduct({
      name,
      warrantyType,
      warrantyPeriod,
      category,
      brand,
      description,
      problem,
      quantity,
      supplier,
      upccode,
      sku,
      // pricing,
      averagejobtime,
      status,
      repairprice,
      tax,
      images, // Store base64 directly
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({ message: "Repair Product created successfully", data: savedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Repair Products
const getAllRepairProducts = async (req, res) => {
  try {
    const products = await RepairProduct.find()
      .populate("category", "category_name") // Fetch category name
      .populate("brand", "brand_name"); // Fetch brand name

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Repair Product by ID
const getRepairProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await RepairProduct.findById(id)
      .populate("category", "category_name")
      .populate("brand", "brand_name");

    if (!product) {
      return res.status(404).json({ message: "Repair Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Export all functions
module.exports = {
  createRepairProduct,
  getAllRepairProducts,
  getRepairProductById,
};
