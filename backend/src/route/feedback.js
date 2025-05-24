const express = require('express');
const router = express.Router();
const feedbackController = require('../app/controller/FeedbackController');

router.get('/', feedbackController.readAllFeedbacks)
router.get('/:id', feedbackController.readAFeedback)
router.post('/', feedbackController.createAFeedback)
router.put('/:id', feedbackController.updateAFeedback)
router.delete('/:id', feedbackController.deleteAFeedback)

module.exports = router;