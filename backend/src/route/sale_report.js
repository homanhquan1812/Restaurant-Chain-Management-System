const express = require('express');
const router = express.Router();
const saleReportController = require('../app/controller/SaleReportController');

router.get('/', saleReportController.readAllSaleReports)
router.post('/', saleReportController.createASaleReport)

module.exports = router;