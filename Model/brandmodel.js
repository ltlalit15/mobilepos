const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
     // unique: true,
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

// Adding a compound unique index on brand_name and category
//brandSchema.index({ brand_name: 1, category: 1 }, { unique: true });
const Brand = mongoose.model("Brand", brandSchema); 
module.exports = Brand;
