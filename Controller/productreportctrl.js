const Product = require("../Model/productmodel");
const Invoice = require("../Model/invoicemodel");


const upload = require("../Middileware/Multer")

const getSalesReport = async (req, res) => {
    try {
        const productReport = await Product.aggregate([
            {
                $addFields: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1 = Sunday, 7 = Saturday
                    price: {
                        $cond: {
                            if: { $eq: [{ $type: "$price" }, "string"] },
                            then: { 
                                $convert: { 
                                    input: { $trim: { input: "$price" } }, 
                                    to: "double", 
                                    onError: 0, 
                                    onNull: 0 
                                } 
                            },
                            else: { 
                                $convert: { 
                                    input: "$price", 
                                    to: "double", 
                                    onError: 0, 
                                    onNull: 0 
                                } 
                            }
                        }
                    },
                    soldQuantity: { $ifNull: [{ $toDouble: "$soldQuantity" }, 0] },
                    shopId: { $ifNull: ["$shopId", "Unknown_Shop"] }
                }
            },
            {
                $group: {
                    _id: { shopId: "$shopId", month: "$month", dayOfWeek: "$dayOfWeek" },
                    totalRevenue: { $sum: { $multiply: ["$price", "$soldQuantity"] } }
                }
            }
        ]);

        const invoiceReport = await Invoice.aggregate([
            {
                $addFields: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    dayOfWeek: { $dayOfWeek: "$createdAt" },
                    totalAmount: { $toDouble: "$total" },
                    shopId: { $ifNull: ["$shopId", "Unknown_Shop"] }
                }
            },
            {
                $group: {
                    _id: { shopId: "$shopId", month: "$month", dayOfWeek: "$dayOfWeek" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Merge both reports
        const mergedData = [...productReport, ...invoiceReport];

        // Helper function to map numeric month to name
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const reportByShops = {};

        mergedData.forEach(({ _id, totalRevenue }) => {
            const { shopId, month, dayOfWeek } = _id;
            const monthName = monthNames[month - 1]; // Convert month number to name
            const dayName = weekDays[dayOfWeek - 1]; // Convert day number to name

            if (!reportByShops[shopId]) {
                reportByShops[shopId] = { shopId, months: {}, week: {} };
            }

            // Aggregate month revenue
            if (!reportByShops[shopId].months[monthName]) {
                reportByShops[shopId].months[monthName] = 0;
            }
            reportByShops[shopId].months[monthName] += totalRevenue;

            // Aggregate weekday revenue
            if (!reportByShops[shopId].week[dayName]) {
                reportByShops[shopId].week[dayName] = 0;
            }
            reportByShops[shopId].week[dayName] += totalRevenue;
        });

        // Convert the reportByShops object into an array
        const response = Object.values(reportByShops);

        res.status(200).json({
            message: "Sales report fetched successfully",
            success: true,
            shops: response
        });

    } catch (error) {
        console.error("Error generating sales report:", error);
        res.status(500).json({ message: "Internal Server Error", success: false, error });
    }
};




module.exports = { getSalesReport };
