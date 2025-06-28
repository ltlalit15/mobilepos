const mongoose = require("mongoose");

const shopschema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
 
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  post_code: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  role: {
    type: String, 
    default: "shop", 
  },
   // ✅ Reset Token for forget/reset password
  resetToken: {
    type: String,
    default: null,
  }
});

const Shop = mongoose.model("Shop", shopschema);

module.exports = Shop;
