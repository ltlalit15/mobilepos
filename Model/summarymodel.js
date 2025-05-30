const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: 'Signup'
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: 'Shop'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  cash: {
    type: Number,
    default: 0
  },
  eftpos: {
    type: Number,
    default: 0
  },
  afterpay: {
    type: Number,
    default: 0
  },
  total_paid: {
    type: Number,
    required: true
  },
  due_amount: {
    type: Number,
    required: true
  },

  invoiceNumber: {
    type: String

  },


  productDetails: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number,

    }
  ],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  
  repairParts: [
    {
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },  // Added categoryId in repair parts
      brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },        // Added brandId in repair parts
      deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Summary = new mongoose.model("Summary", SummarySchema);

module.exports = Summary;
