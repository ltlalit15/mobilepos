const express = require('express');
const router = express.Router();

const upload = require("../Middileware/Multer");
const { createInvoice, getAllInvoices, getInvoiceById,updateInvoiceStatus, deleteInvoice, updateInvoice,getMonthlyRevenue } = require("../Controller/invoicectrl");
const ApplyMiddleware = require('../Middileware/Auth');


// API routes for invoice
router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:invoiceId",getInvoiceById);
router.patch("/",  updateInvoiceStatus);
router.delete("/:invoiceId",  deleteInvoice);
router.patch("/:invoiceId",updateInvoice);
//router.get("/:shop_id",getMonthlyRevenue);

module.exports = router;




