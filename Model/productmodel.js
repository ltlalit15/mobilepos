const mongoose = require("mongoose");
const CounterModel = require("./countermodel");
const productSchema = new mongoose.Schema({

  shop_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Shop collection
    ref: "Shop", // Ensure your Shop model name is "Shop"
    required: true, // If shop_id is mandatory
  },

  name: {
    type: String,
  },

  category: {
    type: String, 
  },

  price: {
    type: String,
   
  },
  sku: {
    type: String,
   
  },
  device: {
    type: String,
   
  },
  brand: {
   type: String,
  
 },
 warrantyPeriod: {
   type: String,
  
 },
  description: {
    type: String,
   
  },
  quantity: {
    type: String,
   
  },
  status: {
    type: String,
  },
  IMEI: {
    type: String,
  },
  warranty: {
    type: String,
  },
  
  images: {
    type: [String],
  },
  taxid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Taxes"
  },
  
}, { timestamps: true });

// **🔹 SKU Auto-Generate Middleware**
productSchema.pre("save", async function (next) {
  const product = this;

  if (!product.sku) { // Agar SKU pehle se set nahi hai
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { field: "sku" },
        { $inc: { count: 1 } }, // Serial number increment karein
        { new: true, upsert: true }
      );

      const serialNumber = counter.count.toString().padStart(5, "0"); // e.g., 00001
      product.sku = `PROD-${serialNumber}`; // e.g., "PROD-00001"

    } catch (error) {
      return next(error);
    }
  }

  next();
});


const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
