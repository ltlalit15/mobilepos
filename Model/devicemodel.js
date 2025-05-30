const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    device_name: {
      type: String,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
      shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop", // Assuming there is a 'Shop' model
        // required: true, // Ensure shop_id is always provided
      },
    },
  {
    timestamps: true, 
  }
);

const Device = mongoose.model("Device", deviceSchema); 
module.exports = Device;
