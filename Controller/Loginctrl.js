const Signup = require("../Model/signupmodel");
const Shop = require("../Model/shopmodel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();

// const LoginCtrl = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Please provide both email and password" });
//     }

//     // Find user by email
//     const user = await Signup.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if password matches
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     // Generate JWT token
//     const secret = process.env.SECERATE_KEY
//     const token = jwt.sign({ id: user._id }, secret, { expiresIn: "12h" });
//     const role= user.role
//     let responseData = { success: true, message: "Login successful", token, role, user };

//     // If user is a shop-owner, fetch shop details
//     if (user.role === "shop") {
//       const shop = await shop.findOne({ ownerId: user._id });

//       if (!shop) {
//         return res.status(404).json({ success: false, message: "Shop not found for this shop-owner" });
//       }

//       responseData.shop = shop;
//     }

//     res.status(200).json(responseData);


//   } catch (error) {
//     console.error("Login error:", error.message); 
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


const LoginCtrl = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password" });
    }

    let user = await Signup.findOne({ email }); // Signup table me check karega
    let shop = null;

    if (!user) {
      shop = await Shop.findOne({ email }); // Agar user nahi mila to Shop table me check karega
    }

    if (!user && !shop) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Password Check
    const validPassword = await bcrypt.compare(password, user ? user.password : shop.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // JWT Token Generate
    const loggedInUser = user || shop;
    const role = user ? user.role : "shop";
    const token = jwt.sign({ id: loggedInUser._id, role }, process.env.SECERATE_KEY, { expiresIn: "12h" });

    let responseData = { 
      success: true, 
      message: "Login successful", 
      token, 
      role, 
      user: loggedInUser 
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = LoginCtrl;
