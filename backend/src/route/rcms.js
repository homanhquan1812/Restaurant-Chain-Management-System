require('dotenv').config()

const express = require('express');
const router = express.Router();
const rcmsController = require('../app/controller/RCMSController');
// const addRouter = express.Router();

router.get(`/rcms_staff`, rcmsController.readAllRcmsStaffs)
router.get(`/rcms_staff/:id`, rcmsController.readARcmsStaff)
router.put(`/rcms_staff/:id`, rcmsController.updateARcmsStaff)
router.delete(`/rcms_staff/:id`, rcmsController.deleteARcmsStaff)

// Add data from new brands
// router.get(`/`, rcmsController.readAllRcms)
// router.post(`/`, rcmsController.createARcms)
// router.use('/add', addRouter)
// addRouter.post('/url', rcmsController.saveConnectionString)
// addRouter.post('/data', rcmsController.addData)

// router.post(`/u_manager`, rcmsController.createARcmsStaff_manager)
// router.post(`/u_employee`, rcmsController.createARcmsStaff_employee)
// addRouter.post('/brand', rcmsController.addBrands)
// addRouter.post('/branch', rcmsController.addBranches)
// addRouter.post('/customer', rcmsController.addCustomers)
// addRouter.post('/staff', rcmsController.addStaffs)
// addRouter.post('/product', rcmsController.addProducts)
// addRouter.post('/feedback', rcmsController.addFeedbacks)
// addRouter.post('/order', rcmsController.addOrders)

module.exports = router;