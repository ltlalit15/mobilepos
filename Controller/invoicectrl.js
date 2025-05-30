const Invoice = require("../Model/invoicemodel");
const upload = require("../Middileware/Multer");
const Product = require("../Model/productmodel");  // ✅ Ensure Product model is imported
const Signup = require("../Model/signupmodel");
const Shop = require("../Model/shopmodel");
const Taxes = require("../Model/taxes.model.js")
const Category = require("../Model/categorymodel");
const Brand = require("../Model/brandmodel.js");
const Device = require("../Model/devicemodel.js");
const RepairParts = require("../Model/repairpartsmodel");




// const createInvoice = async (req, res) => {
//     console.log("------ Invoice Request Body ------", req.body);
  
//     try {
//       const { 
//         customerId, 
//         shopId, 
//         productDetails, // ✅ Expecting array [{ productId, quantity }]
//         // categoryId, 
//         // brandId, 
//         // deviceId, 
//         repairParts,  // 🔹 repairParts as array of { repairPartId, repair_name, price }
//         tax, 
//         subTotal, 
//         total, 
//         status = 0 
//       } = req.body;
  
//       // ✅ Validate Customer
//       const customerExists = await Signup.findById(customerId);
//       if (!customerExists) {
//         return res.status(400).json({ message: "Invalid customerId", success: false });
//       }
  
//       // ✅ Validate Shop
//       const shopExists = await Shop.findById(shopId);
//       if (!shopExists) {
//         return res.status(400).json({ message: "Invalid shopId", success: false });
//       }
  
//       // ✅ Validate Products
//       if (!Array.isArray(productDetails) || productDetails.length === 0) {
//         return res.status(400).json({ message: "productDetails must be a non-empty array", success: false });
//       }
  
//       const productIds = productDetails.map(p => p.productId);
//       const productsExist = await Product.find({ _id: { $in: productIds } });
  
//       if (productsExist.length !== productDetails.length) {
//         return res.status(400).json({ message: "One or more productId(s) are invalid", success: false });
//       }
  
//       // // ✅ Validate Other References
//       // const [categoryExists, brandExists, deviceExists] = await Promise.all([
//       //   categoryId ? Category.findById(categoryId) : null,
//       //   brandId ? Brand.findById(brandId) : null,
//       //   deviceId ? Device.findById(deviceId) : null
//       // ]);
  
//       // if (categoryId && !categoryExists) return res.status(400).json({ message: "Invalid categoryId", success: false });
//       // if (brandId && !brandExists) return res.status(400).json({ message: "Invalid brandId", success: false });
//       // if (deviceId && !deviceExists) return res.status(400).json({ message: "Invalid deviceId", success: false });
  
//       // ✅ Validate Repair Parts (Multiple Entries)
//       if (!Array.isArray(repairParts)) {
//         return res.status(400).json({ message: "repairParts must be an array", success: false });
//       }
  
//       const repairPartIds = repairParts.map(rp => rp.repairPartId);
//       const repairPartsExist = await RepairParts.find({ _id: { $in: repairPartIds } });
  
//       if (repairPartsExist.length !== repairParts.length) {
//         return res.status(400).json({ message: "One or more repairPartId(s) are invalid", success: false });
//       }
  
//       // ✅ Create new invoice
//       const newInvoice = new Invoice({
//         customerId,
//         shopId,
//         productDetails,
//         // categoryId,
//         // brandId,
//         // deviceId,
//         repairParts, // 🔹 Updated: Passing full array instead of single ID
//         tax,
//         subTotal,
//         total,
//         status
//       });
  
//       const data = await newInvoice.save();
//       console.log("Invoice Created: ", data);
  
//       return res.status(201).json({ message: "Invoice created successfully", success: true, data });
  
//     } catch (error) {
//       console.error("Invoice Creation Error: ", error);
//       return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
//   };
const mongoose = require("mongoose");




const createInvoice = async (req, res) => {
    console.log("------ Invoice Request Body ------", req.body);

    const session = await mongoose.startSession();
    session.startTransaction(); // Start transaction for atomic operations

    try {
        const { 
            customerId, 
            shopId, 
            categoryId,         // Include categoryId
            brandId,            // Include brandId
            deviceId, 
            productDetails = [], 
            repairParts = [],  
            tax, 
            subTotal, // Use provided subTotal
            total, // Use provided total
            status = 0 
        } = req.body;

        // // Validate Customer
        // const customerExists = await Signup.findById(customerId);
        // if (!customerExists) {
        //     await session.abortTransaction();
        //     return res.status(400).json({ message: "Invalid customerId", success: false });
        // }

         // ✅ Customer validation ko optional karna
         if (customerId) {
            const customerExists = await Signup.findById(customerId);
            if (!customerExists) {
                await session.abortTransaction();
                return res.status(400).json({ message: "Invalid customerId", success: false });
            }
        }

        // ✅ Validate Shop (Required)
        if (!shopId) {
            return res.status(400).json({ message: "shopId is required", success: false });
        }

        // Validate Shop
        const shopExists = await Shop.findById(shopId);
        if (!shopExists) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid shopId", success: false });
        }

        // Validate Products Only If Provided
        if (Array.isArray(productDetails) && productDetails.length > 0) { 
            const productIds = productDetails.map(p => p.productId);
            const productsExist = await Product.find({ _id: { $in: productIds } }).session(session);

            if (productsExist.length !== productDetails.length) {
                await session.abortTransaction();
                return res.status(400).json({ message: "One or more productId(s) are invalid", success: false });
            }

            // Check stock and reduce stock
            for (const product of productDetails) {
                const dbProduct = productsExist.find(p => p._id.toString() === product.productId);

                if (!dbProduct) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: `Invalid productId: ${product.productId}`, success: false });
                }

                const availableStock = Number(dbProduct.quantity);
                if (availableStock < Number(product.quantity)) {
                    await session.abortTransaction();
                    return res.status(400).json({ message: `Insufficient stock for productId: ${product.productId}`, success: false });
                }

                // Compute new stock value
                const newQuantity = availableStock - Number(product.quantity);
                await Product.findByIdAndUpdate(
                    product.productId,
                    { $set: { quantity: newQuantity.toString() } },
                    { session }
                );
            }
        }

        // Validate Repair Parts
        if (!Array.isArray(repairParts)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "repairParts must be an array", success: false });
        }

        const repairPartIds = repairParts.map(rp => rp.repairPartId);
        const repairPartsExist = await RepairParts.find({ _id: { $in: repairPartIds } }).session(session);

        if (repairPartsExist.length !== repairParts.length) {
            await session.abortTransaction();
            return res.status(400).json({ message: "One or more repairPartId(s) are invalid", success: false });
        }

        console.log("Final Provided subTotal:", subTotal); // Debugging log

        // Create new invoice with the provided subTotal and total
        const newInvoice = new Invoice({
            ...(customerId ? { customerId } : {}),  // ✅ Only include if valid
            shopId,
            categoryId,         // Include categoryId
            brandId,            // Include brandId
            deviceId, 
            productDetails,
            repairParts, 
            tax,
            subTotal,   // Use provided subTotal
            total,      // Use provided total
            status
        });

        const data = await newInvoice.save({ session });
        await session.commitTransaction(); // Commit transaction

        

        console.log("Invoice Created: ", data);
        return res.status(201).json({ message: "Invoice created successfully", success: true, data });

    } catch (error) {
        await session.abortTransaction(); // Rollback transaction if error occurs
        console.error("Invoice Creation Error: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        session.endSession(); // End the session
    }
};




    
const getAllInvoices = async (req, res) => {
    try {
        console.log("Fetching all invoices...");

        let invoices = await Invoice.find()
            .populate("customerId")  // Customer info
            .populate("shopId")  // Shop info
            .populate("tax")  // Tax details
            .populate({
                path: "productDetails.productId",  // Product info inside array
                model: "Product"
            })
            .populate({
                path: "repairParts.repairPartId",  // Fixed repairParts population
                model: "RepairPart"
            })
            .populate({
                path: "repairParts.categoryId",  // Populate categoryId in repairParts
                model: "category"
            })
            .populate({
                path: "repairParts.brandId",  // Populate brandId in repairParts
                model: "Brand"
            })
            .populate({
                path: "repairParts.deviceId",  // Populate deviceId in repairParts
                model: "Device"
            });

        // Transform repairParts array with null check
        invoices = invoices.map(invoice => {
            return {
                ...invoice.toObject(),
                repairParts: invoice.repairParts.map(rp => ({
                    _id: rp._id,
                    repairPartId: rp.repairPartId?._id || "",  // Check for null
                    repair_name: rp.repairPartId?.repair_name || "",  // Default value
                    categoryId: rp.categoryId?._id || "",  // Category ID
                    category_name: rp.categoryId?.category_name || "",  // Category name
                    brandId: rp.brandId?._id || "",  // Brand ID
                    brand_name: rp.brandId?.brand_name || "",  // Brand name
                    deviceId: rp.deviceId?._id || "",  // Device ID
                    device_name: rp.deviceId?.device_name || "",  // Device name
                    createdAt: rp.repairPartId?.createdAt || "",
                    updatedAt: rp.repairPartId?.updatedAt || "",
                    price: rp.price || 0
                }))
            };
        });

        console.log("Transformed Invoices Data:", invoices);
        return res.status(200).json({ success: true, data: invoices });

    } catch (error) {
        console.error("Error Fetching Invoices: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

  

const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        console.log(`Fetching Invoice with ID: ${invoiceId}`);
  
        let invoice = await Invoice.findById(invoiceId)
            .populate("customerId")  // Customer details
            .populate("shopId")  // Shop details
            .populate("tax")  // Tax details
            .populate({
                path: "productDetails.productId",  // Product details inside array
                model: "Product"
            })
            .populate({
                path: "repairParts.repairPartId",  // Repair Parts details inside array
                model: "RepairPart"
            })
            .populate({
                path: "repairParts.categoryId",  // Populate categoryId in repairParts
                model: "category"  // Corrected model name (use proper capitalization for "Category")
            })
            .populate({
                path: "repairParts.brandId",  // Populate brandId in repairParts
                model: "Brand"
            })
            .populate({
                path: "repairParts.deviceId",  // Populate deviceId in repairParts
                model: "Device"
            });
  
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
  
        // Transform repairParts to avoid null values and add category_name, brand_name, and device_name
        invoice = {
            ...invoice.toObject(),
            repairParts: invoice.repairParts.map(rp => ({
                _id: rp._id,
                repairPartId: rp.repairPartId?._id || "",  // Null check for repairPartId
                repair_name: rp.repairPartId?.repair_name || "",  // Default value for repair_name
                categoryId: rp.categoryId?._id || "",  // Category ID
                category_name: rp.categoryId?.category_name || "",  // Category name
                brandId: rp.brandId?._id || "",  // Brand ID
                brand_name: rp.brandId?.brand_name || "",  // Brand name
                deviceId: rp.deviceId?._id || "",  // Device ID
                device_name: rp.deviceId?.device_name || "",  // Device name
                createdAt: rp.repairPartId?.createdAt || "",
                updatedAt: rp.repairPartId?.updatedAt || "",
                price: rp.price || 0
            }))
        };
  
        console.log("Formatted Invoice:", invoice);
        return res.status(200).json({ success: true, data: invoice });
  
    } catch (error) {
        console.error("Error Fetching Invoice: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  




  const updateInvoiceStatus = async (req, res) => {
    try {
      const { invoiceId } = req.body;
      const { status } = req.body;
  console.log("status",req.body);
  
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }
  
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        { status },
        { new: true }
      );
  
      if (!updatedInvoice) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }
  
      return res.status(200).json({ success: true, message: "Invoice status updated", data: updatedInvoice });
  
    } catch (error) {
      console.error("Error Updating Invoice Status:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
   
  
  const deleteInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;  

        const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

        if (!deletedInvoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        return res.status(200).json({ success: true, message: "Invoice deleted successfully", data: deletedInvoice });

    } catch (error) {
        console.error("Error Deleting Invoice:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// const updateInvoice = async (req, res) => {
//   console.log("------ Invoice Update Request Body ------", req.body);

//   try {
//       const { invoiceId } = req.params; // Invoice ID URL se le rahe hain
//       const {
//           customerId, productId, repairTypes, accessories, serviceCharges, tax, subTotal, total, status
//       } = req.body;

//       // Ensure ke invoice exist karti hai
//       const existingInvoice = await Invoice.findById(invoiceId);
//       if (!existingInvoice) {
//           return res.status(404).json({ message: "Invoice not found", success: false });
//       }

//       // Validate Customer
//       if (customerId) {
//           const customerExists = await Signup.findById(customerId);
//           if (!customerExists) {
//               return res.status(400).json({ message: "Invalid customerId", success: false });
//           }
//       }

//       // Validate Products
//       if (productId && (!Array.isArray(productId) || productId.length === 0)) {
//           return res.status(400).json({ message: "productId must be a non-empty array", success: false });
//       }

//       if (productId) {
//           const productsExist = await Product.find({ _id: { $in: productId } });
//           if (productsExist.length !== productId.length) {
//               return res.status(400).json({ message: "One or more productId(s) are invalid", success: false });
//           }
//       }

//       // Parse JSON fields agar string aaye
//       const parsedRepairTypes = typeof repairTypes === "string" ? JSON.parse(repairTypes) : repairTypes;
//       const parsedAccessories = typeof accessories === "string" ? JSON.parse(accessories) : accessories;
//       const parsedServiceCharges = typeof serviceCharges === "string" ? JSON.parse(serviceCharges) : serviceCharges;

//       // Invoice ko update karein
//       const updatedInvoice = await Invoice.findByIdAndUpdate(
//           invoiceId,
//           {
//               customerId,
//               productId,
//               repairTypes: parsedRepairTypes,
//               accessories: parsedAccessories,
//               serviceCharges: parsedServiceCharges,
//               tax,
//               subTotal,
//               total,
//               status: Number(status)
//           },
//           { new: true, runValidators: true } // Updated document return karega
//       );

//       console.log("Invoice Updated: ", updatedInvoice);

//       return res.status(200).json({ message: "Invoice updated successfully", success: true, data: updatedInvoice });

//   } catch (error) {
//       console.error("Invoice Update Error: ", error);
//       return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };



const updateInvoice = async (req, res) => {
  console.log("------ Invoice Update Request Body ------", req.body);

  try {
      const { invoiceId } = req.params; // Invoice ID from URL
      const {
          customerId, 
          shopId, 
          productDetails, // Expecting array [{ productId, quantity }]
          // categoryId, 
          // brandId, 
          // deviceId, 
          repairParts,  // Expecting array [{ repairPartId, repair_name, price }]
          tax, 
          subTotal, 
          total, 
          status
      } = req.body;

      // Check if Invoice Exists
      const existingInvoice = await Invoice.findById(invoiceId);
      if (!existingInvoice) {
          return res.status(404).json({ message: "Invoice not found", success: false });
      }

      // Validate Customer
      if (customerId) {
          const customerExists = await Signup.findById(customerId);
          if (!customerExists) {
              return res.status(400).json({ message: "Invalid customerId", success: false });
          }
      }

      // Validate Shop
      if (shopId) {
          const shopExists = await Shop.findById(shopId);
          if (!shopExists) {
              return res.status(400).json({ message: "Invalid shopId", success: false });
          }
      }

      // Validate Products
      if (productDetails) {
          if (!Array.isArray(productDetails) || productDetails.length === 0) {
              return res.status(400).json({ message: "productDetails must be a non-empty array", success: false });
          }

          const productIds = productDetails.map(p => p.productId);
          const productsExist = await Product.find({ _id: { $in: productIds } });

          if (productsExist.length !== productDetails.length) {
              return res.status(400).json({ message: "One or more productId(s) are invalid", success: false });
          }
      }

      // // Validate Other References
      // const [categoryExists, brandExists, deviceExists] = await Promise.all([
      //     categoryId ? Category.findById(categoryId) : null,
      //     brandId ? Brand.findById(brandId) : null,
      //     deviceId ? Device.findById(deviceId) : null
      // ]);

      // if (categoryId && !categoryExists) return res.status(400).json({ message: "Invalid categoryId", success: false });
      // if (brandId && !brandExists) return res.status(400).json({ message: "Invalid brandId", success: false });
      // if (deviceId && !deviceExists) return res.status(400).json({ message: "Invalid deviceId", success: false });

      // Validate Repair Parts
      if (repairParts) {
          if (!Array.isArray(repairParts)) {
              return res.status(400).json({ message: "repairParts must be an array", success: false });
          }

          const repairPartIds = repairParts.map(rp => rp.repairPartId);
          const repairPartsExist = await RepairParts.find({ _id: { $in: repairPartIds } });

          if (repairPartsExist.length !== repairParts.length) {
              return res.status(400).json({ message: "One or more repairPartId(s) are invalid", success: false });
          }
      }

      // Update Invoice
      const updatedInvoice = await Invoice.findByIdAndUpdate(
          invoiceId,
          {
              customerId,
              shopId,
              productDetails,
              // categoryId,
              // brandId,
              // deviceId,
              repairParts, // Updated: Passing full array instead of single ID
              tax,
              subTotal,
              total,
              status: status !== undefined ? Number(status) : existingInvoice.status
          },
          { new: true, runValidators: true } // Return updated document
      );

      console.log("Invoice Updated: ", updatedInvoice);

      return res.status(200).json({ message: "Invoice updated successfully", success: true, data: updatedInvoice });

  } catch (error) {
      console.error("Invoice Update Error: ", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const getInvoiceReportAmount = async (req, res) => {
    try {
        const now = new Date(); // Always fresh Date object
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const { shopId, startDate, endDate } = req.query;

        // Yesterday
        const startOfYesterday = new Date();
        startOfYesterday.setDate(now.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date();
        endOfYesterday.setDate(now.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        // Last 7 Days
        const startOfLast7Days = new Date();
        startOfLast7Days.setDate(now.getDate() - 7);
        startOfLast7Days.setHours(0, 0, 0, 0);

        // This Month
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Last Month
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // This Year
        const startOfThisYear = new Date(now.getFullYear(), 0, 1);
        const endOfThisYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

        // Last Year
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

        // All Data
        const startOfAll = new Date(0);

        // Custom Date Range
        let startOfCustom = null, endOfCustom = null;
        if (startDate && endDate) {
            startOfCustom = new Date(`${startDate}T00:00:00.000Z`);
            endOfCustom = new Date(`${endDate}T23:59:59.999Z`);
        }

        // Helper function to fetch invoices based on date range
        const getInvoicesByDate = async (startDate, endDate) => {
            const query = { 
                createdAt: { $gte: startDate, $lte: endDate || new Date() }
            };

            if (shopId) query.shopId = shopId;

            return await Invoice.find(query).populate("shopId");
        };

        // Fetch invoices based on filters
        const invoicesToday = await getInvoicesByDate(startOfToday, endOfToday);
        const invoicesYesterday = await getInvoicesByDate(startOfYesterday, endOfYesterday);
        const invoicesLast7Days = await getInvoicesByDate(startOfLast7Days, endOfToday);
        const invoicesThisMonth = await getInvoicesByDate(startOfThisMonth, endOfThisMonth);
        const invoicesLastMonth = await getInvoicesByDate(startOfLastMonth, endOfLastMonth);
        const invoicesThisYear = await getInvoicesByDate(startOfThisYear, endOfThisYear);
        const invoicesLastYear = await getInvoicesByDate(startOfLastYear, endOfLastYear);
        const invoicesAll = await getInvoicesByDate(startOfAll, endOfToday);
        const invoicesCustom = startOfCustom && endOfCustom ? await getInvoicesByDate(startOfCustom, endOfCustom) : [];

        // Function to calculate totals
        const calculateTotals = (invoices) => {
            const totalInvoices = invoices.length;
            const totalPaidInvoices = invoices.filter(invoice => invoice.status === 1).length;
            const totalUnpaidInvoices = invoices.filter(invoice => invoice.status === 0).length;

            const totalPaidAmount = invoices
                .filter(invoice => invoice.status === 1)
                .reduce((sum, invoice) => sum + invoice.total, 0);

            const totalUnpaidAmount = invoices
                .filter(invoice => invoice.status === 0)
                .reduce((sum, invoice) => sum + invoice.total, 0);

            const totalAmount = totalPaidAmount + totalUnpaidAmount;

            return { 
                totalInvoices, 
                totalPaidInvoices, 
                totalUnpaidInvoices, 
                totalPaidAmount, 
                totalUnpaidAmount, 
                totalAmount
            };
        };


        

        // Fetch common `shopId` from invoices (if available)
        const commonshopId = invoicesAll.length > 0 ? invoicesAll[0].shopId?._id : "";

        // Return Final Response
        return res.status(200).json({
            success: true,
            shopId: commonshopId,  // `shopId` included in response
            data: {
                today: calculateTotals(invoicesToday),
                yesterday: calculateTotals(invoicesYesterday),
                last7Days: calculateTotals(invoicesLast7Days),
                thisMonth: calculateTotals(invoicesThisMonth),
                lastMonth: calculateTotals(invoicesLastMonth),
                thisYear: calculateTotals(invoicesThisYear),
                lastYear: calculateTotals(invoicesLastYear),
                all: calculateTotals(invoicesAll),
                custom: startOfCustom && endOfCustom ? calculateTotals(invoicesCustom) : {}
            }
        });

    } catch (error) {
        console.error("Error Fetching Invoice Report: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




// const getMonthlyRevenue = async (req, res) => {
//     try {
//         const { shopId } = req.params;
//         console.log("Received shopId:", shopId);

//         // Validate ObjectId
//         if (!mongoose.isValidObjectId(shopId)) {
//             return res.status(400).json({ success: false, message: "Invalid shop ID format" });
//         }

//         // Convert String to ObjectId
//         const objectshopId = new mongoose.Types.ObjectId(shopId);
//         console.log("Converted Shop ID:", objectshopId);

//         // Find Invoices by Shop ID
//         const invoices = await Invoice.find({ shopId: objectshopId });

//         // Debugging
//         console.log("Fetched Invoices:", invoices);

//         // Check if invoices exist
//         if (!invoices.length) {
//             return res.status(404).json({ success: false, message: "No invoices found for this shop" });
//         }

//         return res.status(200).json({ success: true, data: invoices });

//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };


  
  
  

 module.exports = { createInvoice, getAllInvoices, getInvoiceById, updateInvoiceStatus, deleteInvoice,getInvoiceReportAmount, updateInvoice };



