const mongoose = require("mongoose");

const repairpartsSchema = new mongoose.Schema(
  {
    repair_name: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


const RepairPart = mongoose.model("RepairPart", repairpartsSchema); 
module.exports = RepairPart;
