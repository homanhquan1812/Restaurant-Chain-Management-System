require('dotenv').config()

const express = require('express');
const router = express.Router();
const staffController = require('../app/controller/StaffController');

router.get(`/`, staffController.readAllStaffs)
router.get(`/:id`, staffController.readAStaff)
router.put(`/:id`, staffController.putAStaff)
router.delete(`/:id`, staffController.deleteAStaff)

module.exports = router;