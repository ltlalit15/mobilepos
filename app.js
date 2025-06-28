const express = require('express');
const router = express.Router();

// Import routes
const usersRoutes = require('./Router/usersRoutes');
const productsRoutes = require('./Router/productsRoutes');
const productreportRoutes = require('./Router/productreportRoutes');
const invoiceRoutes= require('./Router/invoiceRoutes');
const shopRoutes= require('./Router/shopRoutes');
const deviceRoutes= require('./Router/deviceRoutes');
const repairpartsRoutes= require('./Router/repairpartsRoutes');
const reportRoutes= require('./Router/reportRoutes');
const brandRoutes= require('./Router/brandRoutes')
const categoryRoutes= require('./Router/categoryRoutes')
const repairProductRoutes= require('./Router/repair_product.Routes.js')
const taxesRoutes= require('./Router/taxes.Routes.js');
const invoiceRouteAmount = require('./Router/invoiceReportAmount.routes.js')
const summaryRoutes = require('./Router/summaryRoutes');
const summaryReportAmount = require('./Router/summaryReportAmount.routes.js');
const getSoldQuantityReport = require('./Router/SoldQuantityReport.routes.js');
const getMultiSaleSummary = require('./Router/MultiSaleSummary.routes.js');
const emailRoutes = require('./Router/emailRoutes');
const singleRoutes = require('./Router/singleRoutes');


// Use routes
router.use('/api/users', usersRoutes);
router.use('/api/products', productsRoutes);
router.use('/api/productreport', productreportRoutes);
router.use('/api/invoice', invoiceRoutes);
router.use('/api/shop', shopRoutes);
router.use('/api/report', reportRoutes);
router.use('/api/brand', brandRoutes);
router.use('/api/device', deviceRoutes);
router.use('/api/repairparts', repairpartsRoutes);
router.use('/api/category', categoryRoutes);
router.use('/api/repair-product',repairProductRoutes);
router.use('/api/taxes',taxesRoutes);
router.use('/api/InvoiceReportAmount',invoiceRouteAmount);
router.use('/api/summary', summaryRoutes);
router.use('/api/getSummaryReportAmount', summaryReportAmount);
router.use('/api/getSoldQuantityReport', getSoldQuantityReport);
router.use('/api/getMultiSaleSummary', getMultiSaleSummary);
router.use('/api/email', emailRoutes);
router.use('/api/single', singleRoutes);

module.exports = router;


