const Shop = require("../Model/shopmodel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();


const shopLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide both email and password" });
      }
  
      // Find shop by email
      const user = await Shop.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "Shop not found" });
      }
  
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
  
      // Generate JWT token
      const secret = process.env.SECERATE_KEY
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "12h" });
      const role= user.role
      res.status(200).json({ success: true, message: "Login successful",  token, role , user});
    } catch (error) {
      console.error("Login error:", error.message); 
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


  
module.exports = shopLogin;