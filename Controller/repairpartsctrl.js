const RepairPart= require('../Model/repairpartsmodel')
const upload = require("../Middileware/Multer")

// create repair
const createRepairPart = async (req, res) => {
    const { repair_name, categoryId } = req.body;
  
    if (!repair_name || !categoryId ) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const newRepair = new RepairPart({
        repair_name,
        category: categoryId
        
      });
  
      const data = await newRepair.save();
  
      if (data) {
        return res.status(200).json({ message: "Repairparts created successfully", success: true, data });
      } else {
        return res.status(400).json({ message: "Device creation error" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };


  const getAllRepairParts = async (req, res) => {
    try {
        const repairParts = await RepairPart.find().populate("category", "category_name"); // Only fetch category_name

        return res.status(200).json({ success: true, data: repairParts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getRepairPartById = async (req, res) => {
    try {
        const { id } = req.params;
        const repairPart = await RepairPart.findById(id);

        if (!repairPart) {
            return res.status(404).json({ success: false, message: "Repair part not found" });
        }

        return res.status(200).json({ success: true, data: repairPart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const updateRepairPart = async (req, res) => {
    try {
        const { id } = req.params;
        const { repair_name, categoryId } = req.body;

        const updatedRepairPart = await RepairPart.findByIdAndUpdate(
            id,
            { repair_name, category: categoryId },
            { new: true }
        );

        if (!updatedRepairPart) {
            return res.status(404).json({ success: false, message: "Repair part not found" });
        }

        return res.status(200).json({ success: true, message: "Repair part updated successfully", data: updatedRepairPart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const deleteRepairPart = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRepairPart = await RepairPart.findByIdAndDelete(id);

        if (!deletedRepairPart) {
            return res.status(404).json({ success: false, message: "Repair part not found" });
        }

        return res.status(200).json({ success: true, message: "Repair part deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


 
module.exports = { createRepairPart, getAllRepairParts, getRepairPartById, updateRepairPart, deleteRepairPart };