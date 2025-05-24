const express = require('express');
const router = express.Router();
const voucherController = require('../app/controller/VoucherController');

router.get('/', voucherController.getAllVouchers)
router.get('/:id', voucherController.getAVoucher)
router.post('/', voucherController.postAVoucher)
router.put('/:id', voucherController.putAVoucher)
router.delete('/:id', voucherController.deleteAVoucher)

module.exports = router;