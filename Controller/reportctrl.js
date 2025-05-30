const Invoice = require("../Model/invoicemodel");
const upload = require("../Middileware/Multer");




const getInvoiceReport = async (req, res) => {
    try {
        // Step 1: Fetch and populate invoices
        const invoices = await Invoice.find()
            .populate("customerId")
            .populate("productId");
  
        console.log("Populated Invoices Data:", invoices);
  
        // Step 2: Calculate repair statistics
        const completedRepairs = invoices.filter(inv => inv.status === 1).length;
        const pendingRepairs = invoices.filter(inv => inv.status === 0).length;
        const totalRepairCost = invoices
            .filter(inv => inv.status === 1)
            .reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);
  
        // Response
        return res.status(200).json({
            success: true,
            data: {
                invoices,
                report: {
                    completedRepairs,
                    pendingRepairs,
                    totalRepairCost
                }
            }
        });
    } catch (error) {
        console.error("Error Fetching Invoice Report: ", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  
  
  module.exports = {getInvoiceReport};
  
