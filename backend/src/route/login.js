const express = require('express');
const router = express.Router();
const loginController = require('../app/controller/LoginController');

router.post('/', loginController.login)
router.post('/forgot_password', loginController.forgotPassword)
router.post('/verify_reset_code', loginController.verifyResetCode)
router.post('/reset_password', loginController.resetPassword)

module.exports = router;