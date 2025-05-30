const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: false },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  productDetails: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Product ID reference
      quantity: { type: Number, default: 1 }, // Default quantity = 1
      price: {type: Number}
    }
  ],

  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }, 
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }, 
    repairParts: [
      {
        repairPartId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairPart' }, // Repair Part ID
        repair_name: { type: String, required: true }, // Repair Name
        price: { type: Number, required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Added categoryId in repair parts
        brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },        // Added brandId in repair parts
        deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }, 
      }
    ],

  
 
  
  tax :{
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Taxes',
  },

  subTotal: { type: Number, default: 0 },

  total: { type: Number, default: 0 },

  status: { type: Number, default: 0 }
}, { timestamps: true });



const Invoice = new mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;
