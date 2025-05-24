const express = require('express');
const router = express.Router();
const registerController = require('../app/controller/RegisterController');

router.post('/rcms_staff', registerController.rcmsStaffRegister)
router.post('/customer', registerController.customerRegister)
router.post('/staff', registerController.staffRegister)

module.exports = router;