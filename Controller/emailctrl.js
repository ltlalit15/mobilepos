const Signup = require("../Model/signupmodel");
const Shop = require("../Model/shopmodel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const adminUser = await Signup.findOne({ email, role: "admin" });
    const relatedShop = await Shop.findOne({
      $or: [{ adminEmail: email }, { email }],
    });

    if (!adminUser && !relatedShop) {
      return res.status(404).json({
        success: false,
        message: "No admin or shop found with this email",
      });
    }

    const rawToken = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(rawToken, salt);

    if (adminUser) {
      adminUser.resetToken = hashedToken;
      await adminUser.save();
    }

    if (relatedShop) {
      relatedShop.resetToken = hashedToken;
      await relatedShop.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'packageitappofficially@gmail.com',
        pass: 'epvuqqesdioohjvi',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Admin Email Template
    const adminMail = `
      <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
        <div style="background-color: #004d40; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Password Reset Requested</h2>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Dear Admin,</p>
          <p>
            We received a request to reset the password for 
            <a href="mailto:${email}" style="color: #0d47a1; text-decoration: none;">${email}</a>.
          </p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://iexpertpos.store/Reset-Password?token=${encodeURIComponent(hashedToken)}"
               style="background-color: #00796b; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 6px;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">
            <strong>Token:</strong> ${hashedToken}
          </p>
          <p>If you didn’t request this, you can ignore this email.</p>
          <p style="margin-top: 40px;">Regards,<br><strong>IExpert Pos Team</strong></p>
        </div>
      </div>
    `;

    // Shop Notification Email Template
    const shopMail = `
      <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
        <div style="background-color: #388e3c; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Admin Reset Alert</h2>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Hello,</p>
          <p>The admin <strong>${email}</strong> has requested a password reset.</p>
          <p>If this was not authorized, please verify immediately.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://iexpertpos.store/Reset-Password?token=${encodeURIComponent(hashedToken)}"
               style="background-color: #43a047; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 6px;">
              Go to Reset Page
            </a>
          </div>
          <p><strong>Token:</strong> ${hashedToken}</p>
          <p style="margin-top: 40px;">Regards,<br><strong>IExpert Pos Team</strong></p>
        </div>
      </div>
    `;

    // Send Admin Email
    if (adminUser) {
      await transporter.sendMail({
        from: 'sagar.kiaan12@gmail.com',
        to: email,
        subject: "Admin Password Reset Notification",
        html: adminMail,
      });
    }

    // Send Shop Email (only if shop email is not same as admin)
    if (relatedShop && relatedShop.email && (!adminUser || relatedShop.email !== email)) {
      await transporter.sendMail({
        from: 'sagar.kiaan12@gmail.com',
        to: relatedShop.email,
        subject: "Admin Password Reset Alert",
        html: shopMail,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset email sent to admin/shop (if matched)",
      token: hashedToken, // ✅ return only for testing; remove in production
    });

  } catch (error) {
    console.error("ForgetPassword Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "token, newPassword, confirmPassword are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        let matchedUser = null;
        let userType = null;

        // ✅ Direct match in Signup model
        const admin = await Signup.findOne({ resetToken: token });
        if (admin) {
            matchedUser = admin;
            userType = "admin";
        }

        // ✅ If not found in admin, check in Shop
        if (!matchedUser) {
            const shop = await Shop.findOne({ resetToken: token });
            if (shop) {
                matchedUser = shop;
                userType = "shop";
            }
        }

        // ✅ If no user matched
        if (!matchedUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // ✅ Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        matchedUser.password = hashedPassword;
        matchedUser.resetToken = undefined;
        await matchedUser.save();

        return res.status(200).json({
            success: true,
            message: `${userType} password reset successfully`
        });

    } catch (error) {
        console.error("ResetPassword Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const updatePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    try {
        if (!id || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "id, oldPassword, and newPassword are required"
            });
        }

        let matchedUser = null;
        let userType = null;

        // ✅ Try Signup
        const admin = await Signup.findById(id);
        if (admin) {
            matchedUser = admin;
            userType = "admin";
        }

        // ✅ Try Shop if not found in Signup
        if (!matchedUser) {
            const shop = await Shop.findById(id);
            if (shop) {
                matchedUser = shop;
                userType = "shop";
            }
        }

        if (!matchedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Compare old password
        const isMatch = await bcrypt.compare(oldPassword, matchedUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // ✅ Hash and save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        matchedUser.password = hashedPassword;
        await matchedUser.save();

        return res.status(200).json({
            success: true,
            message: `${userType} password changed successfully`
        });

    } catch (error) {
        console.error("ChangePasswordWithOld Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { forgetPassword, resetPassword, updatePassword };
