const { DateTime } = require('luxon');
const Summary = require("../Model/summarymodel");
const Shop = require("../Model/shopmodel");
const Category = require("../Model/categorymodel");
const Brand = require("../Model/brandmodel.js");
const Device = require("../Model/devicemodel.js");

const upload = require("../Middileware/Multer")


const createSummary = async (req, res) => {
    console.log("-------- Summary Payload --------", req.body);
  
    try {
      const {
        customer_id,
        shop_id,
        categoryId,    // Include categoryId
        brandId,       // Include brandId
        deviceId, 
        invoiceNumber,
        subtotal,
        tax,
        total,
        cash,
        eftpos,
        afterpay,
        total_paid,
        due_amount,
        productDetails,
        repairParts
      } = req.body;
  
      // ✅ Optional: check if a summary already exists for same customer/shop/total etc. (custom logic)
      // const existing = await Summary.findOne({ customer_id, shop_id, total });
      // if (existing) {
      //   return res.status(409).json({ success: false, message: "Duplicate summary entry." });
      // }
  
      // 📝 Create new summary
      const newSummary = new Summary({
        customer_id,
        shop_id,
        categoryId,         // Include categoryId
        brandId,            // Include brandId
        deviceId, 
        invoiceNumber,
        subtotal,
        tax,
        total,
        cash,
        eftpos,
        afterpay,
        total_paid,
        due_amount,
        productDetails,
        repairParts
      });
  
      const data = await newSummary.save();
      console.log("Saved Summary:", data);
  
      return res.status(201).json({
        message: "Summary created successfully",
        success: true,
        data
      });
  
    } catch (error) {
      console.error("Summary creation error:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message
      });
    }
};


// const getAllSummary = async (req, res) => {
//     try {
//       const summaries = await Summary.find().populate('customer_id').populate('shop_id');
//       res.status(200).json({
//         message: "All summaries fetched successfully",
//         success: true,
//         data: summaries
//       });
//     } catch (error) {
//       console.error("getAllSummary error:", error);
//       res.status(500).json({
//         message: "Internal server error",
//         success: false,
//         error: error.message
//       });
//     }
// };


const getAllSummary = async (req, res) => {
  try {
      const summaries = await Summary.find()
          .populate('customer_id') // Populating customer details
          .populate('shop_id') // Populating shop details
          .populate({
              path: 'repairParts.categoryId', // Populate categoryId in repairParts
              model: 'category'
          })
          .populate({
              path: 'repairParts.brandId', // Populate brandId in repairParts
              model: 'Brand'
          })
          .populate({
              path: 'repairParts.deviceId', // Populate deviceId in repairParts
              model: 'Device'
          });

      // Transform the data to include categoryId, category_name, brandId, brand_name, deviceId, device_name
      const transformedSummaries = summaries.map(summary => ({
          ...summary.toObject(),
          repairParts: summary.repairParts.map(rp => ({
              _id: rp._id,
              name: rp.name || "",       // ✅ Name of the repair part
              quantity: rp.quantity || 0, 
              categoryId: rp.categoryId?._id || "", // Category ID
              category_name: rp.categoryId?.category_name || "", // Category name
              brandId: rp.brandId?._id || "", // Brand ID
              brand_name: rp.brandId?.brand_name || "", // Brand name
              deviceId: rp.deviceId?._id || "", // Device ID
              device_name: rp.deviceId?.device_name || "", // Device name
              price: rp.price || 0, // Example price field, adjust based on your model
              createdAt: rp.createdAt || "",
              updatedAt: rp.updatedAt || ""
          }))
      }));

      res.status(200).json({
          message: "All summaries fetched successfully",
          success: true,
          data: transformedSummaries
      });
  } catch (error) {
      console.error("getAllSummary error:", error);
      res.status(500).json({
          message: "Internal server error",
          success: false,
          error: error.message
      });
  }
};




const getSummaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = await Summary.findById(id)
      .populate('customer_id') // Populating customer details
      .populate('shop_id') // Populating shop details
      .populate({
          path: 'repairParts.categoryId', // Populate categoryId in repairParts
          model: 'category' // Make sure to use correct model name
      })
      .populate({
          path: 'repairParts.brandId', // Populate brandId in repairParts
          model: 'Brand'
      })
      .populate({
          path: 'repairParts.deviceId', // Populate deviceId in repairParts
          model: 'Device'
      });

    if (!summary) {
      return res.status(404).json({
        message: "Summary not found",
        success: false
      });
    }

    // Transform the data to include categoryId, category_name, brandId, brand_name, deviceId, device_name
    const transformedSummary = {
        ...summary.toObject(),
        repairParts: summary.repairParts.map(rp => ({
            _id: rp._id,
            name: rp.name || "",       // ✅ Name of the repair part
            quantity: rp.quantity || 0,
            categoryId: rp.categoryId?._id || "", // Category ID
            category_name: rp.categoryId?.category_name || "", // Category name
            brandId: rp.brandId?._id || "", // Brand ID
            brand_name: rp.brandId?.brand_name || "", // Brand name
            deviceId: rp.deviceId?._id || "", // Device ID
            device_name: rp.deviceId?.device_name || "", // Device name
            price: rp.price || 0, // Example price field, adjust based on your model
            createdAt: rp.createdAt || "",
            updatedAt: rp.updatedAt || ""
        }))
    };

    res.status(200).json({
      message: "Summary fetched successfully",
      success: true,
      data: transformedSummary
    });
  } catch (error) {
    console.error("getSummaryById error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};



const updateSummary = async (req, res) => {
  const { id } = req.params; // summary ID from URL
  const updates = req.body;  // fields to update

  console.log("-------- Summary Update Payload --------", updates);

  try {
    const updatedSummary = await Summary.findByIdAndUpdate(
      id,
      { ...updates, updated_at: new Date() },
      { new: true }
    );

    if (!updatedSummary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found"
      });
    }

    return res.status(200).json({
      message: "Summary updated successfully",
      success: true,
      data: updatedSummary
    });

  } catch (error) {
    console.error("Summary update error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};


const deleteSummary = async (req, res) => { 
    try {
      const { id } = req.params;
  
      const deleted = await Summary.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({
          message: "Summary not found",
          success: false
        });
      }
  
      res.status(200).json({
        message: "Summary deleted successfully",
        success: true,
       // data: deleted
      });
    } catch (error) {
      console.error("deleteSummary error:", error);
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message
      });
    }
};


// indian time zone
// const getSummaryReportAmount = async (req, res) => {
//   try {
//     const now = new Date();
//     const { shop_id, customer_id, start_date, end_date } = req.query;

//     // All date ranges
//     const getRange = (start, end) => ({ $gte: start, $lte: end });

//     const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
//     const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);

//     const startOfYesterday = new Date(); startOfYesterday.setDate(now.getDate() - 1); startOfYesterday.setHours(0, 0, 0, 0);
//     const endOfYesterday = new Date(); endOfYesterday.setDate(now.getDate() - 1); endOfYesterday.setHours(23, 59, 59, 999);

//     const startOfLast7Days = new Date(); startOfLast7Days.setDate(now.getDate() - 6); startOfLast7Days.setHours(0, 0, 0, 0);

//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

//     const startOfThisYear = new Date(now.getFullYear(), 0, 1);
//     const endOfThisYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

//     const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
//     const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

//     const startOfAll = new Date(0);

//     let startOfCustom = null, endOfCustom = null;
//     if (start_date && end_date) {
//       startOfCustom = new Date(`${start_date}T00:00:00.000Z`);
//       endOfCustom = new Date(`${end_date}T23:59:59.999Z`);
//     }

//     const buildQuery = (start, end) => {
//       const query = {
//         created_at: getRange(start, end),
//       };
//       if (shop_id) query.shop_id = shop_id;
//       if (customer_id) query.customer_id = customer_id;
//       return query;
//     };

//     const fetchSummaries = async (start, end) => {
//       const data = await Summary.find(buildQuery(start, end));
//       return data.reduce((acc, summary) => {
//         acc.total_entries += 1;
//         acc.total_subtotal += summary.subtotal || 0;
//         acc.total_tax += summary.tax || 0;
//         acc.total_amount += summary.total || 0;
//         acc.total_cash += summary.cash || 0;
//         acc.total_eftpos += summary.eftpos || 0;
//         acc.total_afterpay += summary.afterpay || 0;
//         acc.total_paid += summary.total_paid || 0;
//         acc.total_due += summary.due_amount || 0;
//         return acc;
//       }, {
//         total_entries: 0,
//         total_subtotal: 0,
//         total_tax: 0,
//         total_amount: 0,
//         total_cash: 0,
//         total_eftpos: 0,
//         total_afterpay: 0,
//         total_paid: 0,
//         total_due: 0
//       });
//     };

//     const results = {
//       today: await fetchSummaries(startOfToday, endOfToday),
//       yesterday: await fetchSummaries(startOfYesterday, endOfYesterday),
//       last7Days: await fetchSummaries(startOfLast7Days, endOfToday),
//       thisMonth: await fetchSummaries(startOfThisMonth, endOfThisMonth),
//       lastMonth: await fetchSummaries(startOfLastMonth, endOfLastMonth),
//       thisYear: await fetchSummaries(startOfThisYear, endOfThisYear),
//       lastYear: await fetchSummaries(startOfLastYear, endOfLastYear),
//       all: await fetchSummaries(startOfAll, endOfToday),
//       custom: startOfCustom && endOfCustom ? await fetchSummaries(startOfCustom, endOfCustom) : {}
//     };


//     // Add top-level totals for revenue
//       const totals = {
//         todayRevenue: results.today.total_amount,
//         thisMonthRevenue: results.thisMonth.total_amount,
//         thisYearRevenue: results.thisYear.total_amount
//       };
    

//       return res.status(200).json({
//         success: true,
//         message: "Dashboard summary fetched successfully",
//         data: {
//           ...results,
//           totals
//         }
//       });

//   } catch (error) {
//     console.error("dashboardSummary error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };


// Australia Melbourne time zone 
const getSummaryReportAmount = async (req, res) => {
  try {
    const now = DateTime.now().setZone('Australia/Melbourne');
    const { shop_id, customer_id, start_date, end_date } = req.query;

    // All date ranges
    const getRange = (start, end) => ({
      $gte: start.toJSDate(),
      $lte: end.toJSDate()
    });

    const startOfToday = now.startOf('day');
    const endOfToday = now.endOf('day');

    const startOfYesterday = now.minus({ days: 1 }).startOf('day');
    const endOfYesterday = now.minus({ days: 1 }).endOf('day');

    const startOfLast7Days = now.minus({ days: 6 }).startOf('day');

    const startOfThisMonth = now.startOf('month');
    const endOfThisMonth = now.endOf('month');

    const startOfLastMonth = now.minus({ months: 1 }).startOf('month');
    const endOfLastMonth = now.minus({ months: 1 }).endOf('month');

    const startOfThisYear = now.startOf('year');
    const endOfThisYear = now.endOf('year');

    const startOfLastYear = now.minus({ years: 1 }).startOf('year');
    const endOfLastYear = now.minus({ years: 1 }).endOf('year');

    const startOfAll = DateTime.fromMillis(0).setZone('Australia/Melbourne');

    let startOfCustom = null, endOfCustom = null;
    if (start_date && end_date) {
      startOfCustom = DateTime.fromISO(start_date, { zone: 'Australia/Melbourne' }).startOf('day');
      endOfCustom = DateTime.fromISO(end_date, { zone: 'Australia/Melbourne' }).endOf('day');
    }

    const buildQuery = (start, end) => {
      const query = {
        created_at: getRange(start, end),
      };
      if (shop_id) query.shop_id = shop_id;
      if (customer_id) query.customer_id = customer_id;
      return query;
    };

    const fetchSummaries = async (start, end) => {
      const data = await Summary.find(buildQuery(start, end));
      return data.reduce((acc, summary) => {
        acc.total_entries += 1;
        acc.total_subtotal += summary.subtotal || 0;
        acc.total_tax += summary.tax || 0;
        acc.total_amount += summary.total || 0;
        acc.total_cash += summary.cash || 0;
        acc.total_eftpos += summary.eftpos || 0;
        acc.total_afterpay += summary.afterpay || 0;
        acc.total_paid += summary.total_paid || 0;
        acc.total_due += summary.due_amount || 0;
        return acc;
      }, {
        total_entries: 0,
        total_subtotal: 0,
        total_tax: 0,
        total_amount: 0,
        total_cash: 0,
        total_eftpos: 0,
        total_afterpay: 0,
        total_paid: 0,
        total_due: 0
      });
    };

    const results = {
      today: await fetchSummaries(startOfToday, endOfToday),
      yesterday: await fetchSummaries(startOfYesterday, endOfYesterday),
      last7Days: await fetchSummaries(startOfLast7Days, endOfToday),
      thisMonth: await fetchSummaries(startOfThisMonth, endOfThisMonth),
      lastMonth: await fetchSummaries(startOfLastMonth, endOfLastMonth),
      thisYear: await fetchSummaries(startOfThisYear, endOfThisYear),
      lastYear: await fetchSummaries(startOfLastYear, endOfLastYear),
      all: await fetchSummaries(startOfAll, endOfToday),
      custom: startOfCustom && endOfCustom ? await fetchSummaries(startOfCustom, endOfCustom) : {}
    };

    const totals = {
      todayRevenue: results.today.total_amount,
      thisMonthRevenue: results.thisMonth.total_amount,
      thisYearRevenue: results.thisYear.total_amount
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: {
        ...results,
        totals
      }
    });

  } catch (error) {
    console.error("dashboardSummary error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



// indian time zone
// const getSoldQuantityReport = async (req, res) => {
//   try {
//     const now = new Date();
//     const { shop_id, customer_id, start_date, end_date } = req.query;

//     // All date ranges
//     const getRange = (start, end) => ({ $gte: start, $lte: end });

//     const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
//     const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);

//     const startOfYesterday = new Date(); startOfYesterday.setDate(now.getDate() - 1); startOfYesterday.setHours(0, 0, 0, 0);
//     const endOfYesterday = new Date(); endOfYesterday.setDate(now.getDate() - 1); endOfYesterday.setHours(23, 59, 59, 999);

//     const startOfLast7Days = new Date(); startOfLast7Days.setDate(now.getDate() - 6); startOfLast7Days.setHours(0, 0, 0, 0);

//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

//     const startOfThisYear = new Date(now.getFullYear(), 0, 1);
//     const endOfThisYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

//     const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
//     const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

//     const startOfAll = new Date(0);

//     let startOfCustom = null, endOfCustom = null;
//     if (start_date && end_date) {
//       startOfCustom = new Date(`${start_date}T00:00:00.000Z`);
//       endOfCustom = new Date(`${end_date}T23:59:59.999Z`);
//     }

//     const buildQuery = (start, end) => {
//       const query = {
//         created_at: getRange(start, end),
//       };
//       if (shop_id) query.shop_id = shop_id;
//       if (customer_id) query.customer_id = customer_id;
//       return query;
//     };

//     const fetchSoldQuantities = async (start, end) => {
//       const summaries = await Summary.find(buildQuery(start, end)).populate('shop_id');  // Populate shop_id with store details

//       // Reduce the data to calculate sold quantities
//       return summaries.reduce((acc, summary) => {
//         // Get the store name and ID from populated shop_id
//         const storeName = summary.shop_id ? summary.shop_id.name : "Unknown Store"; // Assuming 'name' is the field containing the store name
//         const storeId = summary.shop_id ? summary.shop_id._id : "Unknown Store ID"; // Assuming '_id' contains the store ID

//         // Loop through productDetails in the summary to get quantities sold (ignoring repairParts)
//         summary.productDetails.forEach((product) => {
//           const itemName = product.name || "Unknown Item"; // Fallback to "Unknown Item"
//           const quantity = product.quantity || 0;

//           // Update the aggregation object with the sold quantity for each item and store
//           if (!acc[itemName]) {
//             acc[itemName] = { total_sold: 0, stores: {} };
//           }
//           acc[itemName].total_sold += quantity;

//           if (!acc[itemName].stores[storeName]) {
//             acc[itemName].stores[storeName] = { store_id: storeId, quantity: 0 };
//           }
//           acc[itemName].stores[storeName].quantity += quantity;
//         });

//         return acc;
//       }, {});
//     };

//     const results = {
//       today: await fetchSoldQuantities(startOfToday, endOfToday),
//       yesterday: await fetchSoldQuantities(startOfYesterday, endOfYesterday),
//       last7Days: await fetchSoldQuantities(startOfLast7Days, endOfToday),
//       thisMonth: await fetchSoldQuantities(startOfThisMonth, endOfThisMonth),
//       lastMonth: await fetchSoldQuantities(startOfLastMonth, endOfLastMonth),
//       thisYear: await fetchSoldQuantities(startOfThisYear, endOfThisYear),
//       lastYear: await fetchSoldQuantities(startOfLastYear, endOfLastYear),
//       all: await fetchSoldQuantities(startOfAll, endOfToday),
//       custom: startOfCustom && endOfCustom 
//         ? await fetchSoldQuantities(startOfCustom, endOfCustom) 
//         : {} // Only fetch for custom range when both dates are provided, else return empty object
//     };
    

//     return res.status(200).json({
//       success: true,
//       message: "Sold quantity summary fetched successfully",
//       data: results
//     });

//   } catch (error) {
//     console.error("soldQuantityReport error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };



// Australia time zone
const getSoldQuantityReport = async (req, res) => {
  try {
    const now = DateTime.now().setZone('Australia/Melbourne');
    const { shop_id, customer_id, start_date, end_date } = req.query;

    // All date ranges using Melbourne time
    const getRange = (start, end) => ({ $gte: start.toJSDate(), $lte: end.toJSDate() });

    const startOfToday = now.startOf('day');
    const endOfToday = now.endOf('day');

    const startOfYesterday = now.minus({ days: 1 }).startOf('day');
    const endOfYesterday = now.minus({ days: 1 }).endOf('day');

    const startOfLast7Days = now.minus({ days: 6 }).startOf('day');

    const startOfThisMonth = now.startOf('month');
    const endOfThisMonth = now.endOf('month');

    const startOfLastMonth = now.minus({ months: 1 }).startOf('month');
    const endOfLastMonth = now.minus({ months: 1 }).endOf('month');

    const startOfThisYear = now.startOf('year');
    const endOfThisYear = now.endOf('year');

    const startOfLastYear = now.minus({ years: 1 }).startOf('year');
    const endOfLastYear = now.minus({ years: 1 }).endOf('year');

    const startOfAll = DateTime.fromMillis(0).setZone('Australia/Melbourne');

    let startOfCustom = null, endOfCustom = null;
    if (start_date && end_date) {
      startOfCustom = DateTime.fromISO(`${start_date}T00:00:00`, { zone: 'Australia/Melbourne' });
      endOfCustom = DateTime.fromISO(`${end_date}T23:59:59.999`, { zone: 'Australia/Melbourne' });
    }

    const buildQuery = (start, end) => {
      const query = {
        created_at: getRange(start, end),
      };
      if (shop_id) query.shop_id = shop_id;
      if (customer_id) query.customer_id = customer_id;
      return query;
    };

    const fetchSoldQuantities = async (start, end) => {
      const summaries = await Summary.find(buildQuery(start, end)).populate('shop_id');

      return summaries.reduce((acc, summary) => {
        const storeName = summary.shop_id ? summary.shop_id.name : "Unknown Store";
        const storeId = summary.shop_id ? summary.shop_id._id : "Unknown Store ID";

        summary.productDetails.forEach((product) => {
          const itemName = product.name || "Unknown Item";
          const quantity = product.quantity || 0;

          if (!acc[itemName]) {
            acc[itemName] = { total_sold: 0, stores: {} };
          }
          acc[itemName].total_sold += quantity;

          if (!acc[itemName].stores[storeName]) {
            acc[itemName].stores[storeName] = { store_id: storeId, quantity: 0 };
          }
          acc[itemName].stores[storeName].quantity += quantity;
        });

        return acc;
      }, {});
    };

    const results = {
      today: await fetchSoldQuantities(startOfToday, endOfToday),
      yesterday: await fetchSoldQuantities(startOfYesterday, endOfYesterday),
      last7Days: await fetchSoldQuantities(startOfLast7Days, endOfToday),
      thisMonth: await fetchSoldQuantities(startOfThisMonth, endOfThisMonth),
      lastMonth: await fetchSoldQuantities(startOfLastMonth, endOfLastMonth),
      thisYear: await fetchSoldQuantities(startOfThisYear, endOfThisYear),
      lastYear: await fetchSoldQuantities(startOfLastYear, endOfLastYear),
      all: await fetchSoldQuantities(startOfAll, endOfToday),
      custom: startOfCustom && endOfCustom 
        ? await fetchSoldQuantities(startOfCustom, endOfCustom) 
        : {}
    };

    return res.status(200).json({
      success: true,
      message: "Sold quantity summary fetched successfully",
      data: results
    });

  } catch (error) {
    console.error("soldQuantityReport error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



const getMultiSaleSummary = async (req, res) => {
  try {
    const { shop_id, customer_id, start_date, end_date } = req.query;

    // Define the date range filter
    const getRange = (start, end) => ({ $gte: start, $lte: end });

    const now = new Date();

    // Define start and end of today, yesterday, last 7 days, this month, last month, etc.
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);

    const startOfYesterday = new Date(); startOfYesterday.setDate(now.getDate() - 1); startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(); endOfYesterday.setDate(now.getDate() - 1); endOfYesterday.setHours(23, 59, 59, 999);

    const startOfLast7Days = new Date(); startOfLast7Days.setDate(now.getDate() - 6); startOfLast7Days.setHours(0, 0, 0, 0);

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    const endOfThisYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

    const startOfAll = new Date(0);

    let startOfCustom = null, endOfCustom = null;
    if (start_date && end_date) {
      startOfCustom = new Date(`${start_date}T00:00:00.000Z`);
      endOfCustom = new Date(`${end_date}T23:59:59.999Z`);
    }

    // Build the query based on date and optional shop_id
    const buildQuery = (start, end) => {
      const query = {
        created_at: getRange(start, end),
      };
      if (shop_id) query.shop_id = shop_id;  // Ensures we filter by shop_id
      if (customer_id) query.customer_id = customer_id;  // Optional customer filter
      return query;
    };

    // Fetch all shops list from the Shop model
    const allShops = await Shop.find(); // Assumes Shop model is present
    const shopList = allShops.map(shop => shop.name);

    // Fetch the multi-sale summary data from Summary model
    const fetchSummaryData = async (start, end) => {
      const summaries = await Summary.find(buildQuery(start, end)).populate('shop_id'); // Populate shop_id with store details

      return summaries.reduce((acc, summary) => {
        const storeName = summary.shop_id ? summary.shop_id.name : "Unknown Store"; // Assuming 'name' is the field containing the store name
        
        // Initialize data if not present
        if (!acc[storeName]) {
          acc[storeName] = {
            repairs: 0,
            products: 0,
            numInvoices: 0,
            totalAmount: 0,
          };
        }

        // Sum repairs (from repairParts array)
        summary.repairParts.forEach(repair => {
          acc[storeName].repairs += repair.price * repair.quantity || 0;  // Repairs total value
        });

        // Sum product details (price * quantity for each product)
        summary.productDetails.forEach(product => {
          acc[storeName].products += product.price * product.quantity || 0;  // Product total value
        });

        // Sum total sales (invoice total) and total paid (sum of payments)
        acc[storeName].totalAmount += summary.total || 0;  // Total value of the invoice
        acc[storeName].numInvoices += 1; // Count number of invoices

        return acc;
      }, {});
    };

    // Execute for custom date range or fallback to the default range
    const results = {
      today: await fetchSummaryData(startOfToday, endOfToday),
      yesterday: await fetchSummaryData(startOfYesterday, endOfYesterday),
      last7Days: await fetchSummaryData(startOfLast7Days, endOfToday),
      thisMonth: await fetchSummaryData(startOfThisMonth, endOfThisMonth),
      lastMonth: await fetchSummaryData(startOfLastMonth, endOfLastMonth),
      thisYear: await fetchSummaryData(startOfThisYear, endOfThisYear),
      lastYear: await fetchSummaryData(startOfLastYear, endOfLastYear),
      all: await fetchSummaryData(startOfAll, endOfToday),
      custom: startOfCustom && endOfCustom 
        ? await fetchSummaryData(startOfCustom, endOfCustom) 
        : {}
    };

    // Initialize the totals object (only calculate totals once per shop)
    const totals = {};

    // First, populate totals with "all" time range data (this should be the accumulated total for each shop)
    for (const shopName in results.all) {
      const shopData = results.all[shopName];
      totals[shopName] = {
        repairs: shopData.repairs,
        products: shopData.products,
        numInvoices: shopData.numInvoices,
        totalAmount: shopData.totalAmount,
      };
    }

    // Now, we need to add today's data to the totals
    for (const shopName in results.today) {
      const todayData = results.today[shopName];

      if (totals[shopName]) {
        totals[shopName].repairs += todayData.repairs || 0;
        totals[shopName].products += todayData.products || 0;
        totals[shopName].numInvoices += todayData.numInvoices || 0;
        totals[shopName].totalAmount += todayData.totalAmount || 0;
      }
    }

    // Final result including the list of all shops and their totals
    const finalResult = {
      shops: shopList,
      summaryData: results,
      totals: totals
    };

    return res.status(200).json({
      success: true,
      message: "Multi-sale summary fetched successfully",
      data: finalResult
    });

  } catch (error) {
    console.error("Multi-sale summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

 
  

module.exports = { createSummary, getAllSummary, getSummaryById, deleteSummary, getSummaryReportAmount, getSoldQuantityReport, getMultiSaleSummary, updateSummary };




