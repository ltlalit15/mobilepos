const Taxes = require("../Model/taxes.model.js")

const createTax = async (req, res) => {
  try {
    const { taxClass, taxValue } = req.body;

    if (!taxClass || taxValue === undefined) {
      return res.status(400).json({ message: "Tax class and value are required!" });
    }

    const newTax = new Taxes({ taxClass, taxValue });
    const savedTax = await newTax.save();

    return res.status(201).json({ message: "Tax created successfully", data: savedTax });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get All Taxes
const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Taxes.find();
    return res.status(200).json({ success: true, data: taxes });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Tax by ID
const getTaxById = async (req, res) => {
  try {
    const { id } = req.params;
    const tax = await Taxes.findById(id);

    if (!tax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    return res.status(200).json({ success: true, data: tax });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update Tax by ID
const updateTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { taxClass, taxValue } = req.body;

    const updatedTax = await Taxes.findByIdAndUpdate(
      id,
      { taxClass, taxValue },
      { new: true, runValidators: true }
    );

    if (!updatedTax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    return res.status(200).json({ message: "Tax updated successfully", data: updatedTax });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Delete Tax by ID
const deleteTax = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTax = await Taxes.findByIdAndDelete(id);
    if (!deletedTax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    return res.status(200).json({ message: "Tax deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Export all functions
module.exports = {
  createTax,
  getAllTaxes,
  getTaxById,
  updateTax,
  deleteTax,
};
