const Signup = require("../Model/signupmodel");
const ShopSchema = require("../Model/shopmodel");
const bcrypt = require('bcryptjs');
//const nodemailer = require("nodemailer");
require('dotenv').config();

const SignupCtrl = async (req, res) => {
  console.log(req.body)
  const { shop_id, first_name, last_name, email, password, phone, address, post_code, city, state, country } = req.body;

  if (!shop_id || !first_name || !last_name || !email || !phone || !address || !post_code || !city || !state || !country) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }


  try {
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword = password ? await bcrypt.hash(password, 10) : "";

    //const hashedPassword = await bcrypt.hash(password, 10);


    const user = new Signup({ shop_id, first_name, last_name, email, password: hashedPassword, phone, address, post_code, city, state, country });
    const data = await user.save();
    if (data) {
      return res.status(200).json({ message: "Signup successfully ", success: "true", user: user });
    } else {
      return res.status(400).json({ message: "registation faild" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




const mongoose = require('mongoose');

const SingledatabyId = async (req, res) => {
  try {
    const { id } = req.query;

    // If id is not provided, return all Signup data
    if (!id) {
      const allData = await Signup.find();
      return res.status(200).json({ message: "All data retrieved successfully", success: true, data: allData });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format", success: false });
    }

    // Try to find data by id
    let result = await ShopSchema.findById(id);
    if (!result) {
      result = await Signup.findById(id);
    }

    if (!result) {
      return res.status(404).json({ message: "Data not found", success: false });
    }

    res.status(200).json({ message: "Data retrieved successfully", success: true, data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const Singledata = async (req, res) => {
  const response = await Signup.findOne({ _id: req.params.sid })
  // console.log(response)
  try {
    if (response) {
      return res.status(200).json({ message: "Data fetch successfully", success: true, data: response });
    } else {
      return res.status(400).json({ message: "error" });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "internal server error" });
  }
}

const Deletedata = async (req, res) => {
  try {
    const response = await Signup.findByIdAndDelete(req.params.did);
    if (!response) {
      return res.status(404).json({ message: "Data not found", success: false });
    }
    res.status(200).json({ message: "Data deleted successfully", success: true, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const updatedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, address, post_code, city, state, country } = req.body;

    const user = await Signup.findById(id);
    if (!user) {
      
      return res.status(404).json({ message: "User not found" });
    }

    // **Shop ID and Password will not be updated**
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    //if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (post_code) user.post_code = post_code;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        //shop_id: user.shop_id, // **Shop ID remains unchanged**
        first_name: user.first_name,
        last_name: user.last_name,
        // email: user.email,
        phone: user.phone,
        address: user.address,
        post_code: user.post_code,
        city: user.city,
        state: user.state,
        country: user.country
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




module.exports = { SignupCtrl, Deletedata, Singledata, updatedUser, SingledatabyId };
