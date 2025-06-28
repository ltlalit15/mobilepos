const Signup = require("../Model/signupmodel");
const Shop = require("../Model/shopmodel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // ✅ Check admin in Signup
        const adminUser = await Signup.findOne({ email, role: "admin" });

        // ✅ Check shop by adminEmail or direct email
        const relatedShop = await Shop.findOne({
            $or: [{ adminEmail: email }, { email: email }],
        });

        // ✅ No match
        if (!adminUser && !relatedShop) {
            return res.status(404).json({
                success: false,
                message: "No admin or shop found with this email",
            });
        }

        // ✅ Generate 6-digit token
        const rawToken = Math.floor(100000 + Math.random() * 900000).toString();

        // ✅ Hash with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedToken = await bcrypt.hash(rawToken, salt);

        // ✅ Save hashed token to adminUser or relatedShop
        if (adminUser) {
            adminUser.resetToken = hashedToken;
            await adminUser.save(); // ✅ SAVE in Signup collection
        }

        if (relatedShop) {
            relatedShop.resetToken = hashedToken;
            await relatedShop.save(); // ✅ SAVE in Shop collection
        }

        // ✅ Setup transporter
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

        // ✅ Admin Email HTML
        const adminMail = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: #004d40; color: white; padding: 20px; text-align: center;">
              <h2>Password Reset Requested</h2>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Dear Admin,</p>
              <p>We received a request to reset the password for your account <strong>${email}</strong>.</p>
              <p>If you initiated this request, click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://192.168.1.28:5173/Reset-Password" target="_blank" style="background-color: #00796b; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p>If you did not request this, please ignore this email.</p>
              <p style="margin-top: 30px;">Regards,<br><strong>IExpert Pos Team</strong></p>
            </div>
            <div style="background: #e0e0e0; color: #555; text-align: center; padding: 10px; font-size: 12px;">
              © 2025 IExpertPos. All rights reserved.
            </div>
          </div>
        </div>
        `;

        // ✅ Shop Email HTML
        const shopMail = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: #388e3c; color: white; padding: 20px; text-align: center;">
              <h2>Admin Reset Alert</h2>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Hello,</p>
              <p>This is to inform you that the admin with email <strong>${email}</strong> has requested to reset their password.</p>
              <p>If this was authorized by your team, no action is required. Otherwise, we recommend verifying immediately.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://192.168.1.28:5173/Reset-Password" target="_blank" style="background-color: #43a047; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Go to Reset Page
                </a>
              </div>
              <p style="margin-top: 30px;">Regards,<br><strong>IExpert Pos Team</strong></p>
            </div>
            <div style="background: #e0e0e0; color: #555; text-align: center; padding: 10px; font-size: 12px;">
              © 2025 IExpertPos. All rights reserved.
            </div>
          </div>
        </div>
        `;

        // ✅ Send to Admin (if found)
        if (adminUser) {
            await transporter.sendMail({
                from: 'sagar.kiaan12@gmail.com',
                to: email,
                subject: "Admin Password Reset Notification",
                html: adminMail,
            });
        }

        // ✅ Send to Shop (if found & not same email already sent)
        if (relatedShop && relatedShop.email) {
            if (!adminUser || relatedShop.email !== email) {
                await transporter.sendMail({
                    from: 'sagar.kiaan12@gmail.com',
                    to: relatedShop.email,
                    subject: "Admin Password Reset Alert",
                    html: shopMail,
                });
            }
        }

        // ✅ Final response
        res.status(200).json({
            success: true,
            message: "Reset email sent to admin/shop (if matched)",
            token: hashedToken
        });

    } catch (error) {
        console.error("ForgetPassword Error:", error);
        res.status(500).json({
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

module.exports = { forgetPassword, resetPassword };
