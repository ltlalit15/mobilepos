const mongoose = require("mongoose");
const Signup = require("../Model/signupmodel");
const Shop = require("../Model/shopmodel");

const singleDataById = async (req, res) => {
  try {
    const { id } = req.query;

    // ✅ ID must be provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required to fetch data",
      });
    }

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // ✅ Try to find in Shop
    let result = await Shop.findById(id);

    // ✅ If not found, try Signup
    if (!result) {
      result = await Signup.findById(id);
    }

    // ❌ Still not found
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No data found for the provided ID",
      });
    }

    // ✅ Found
    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error in singleDataById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {singleDataById};
