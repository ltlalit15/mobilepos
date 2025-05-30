const mongoose = require("mongoose");

const signupschema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Shop collection
    ref: "shop", // Ensure your Shop model name is 'Shop'
    //required: true, // If shop_id is mandatory
  },

  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    //required: true,
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
    default: "user", 
  },
});


const Customer = mongoose.model("Signup", signupschema);

module.exports = Customer;
