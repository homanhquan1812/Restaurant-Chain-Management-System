const express = require('express');
const router = express.Router();
const blogController = require('../app/controller/BlogController');

router.get('/', blogController.getAllBlogs)
router.get('/:id', blogController.getABlog)
router.post('/', blogController.postABlog)
router.put('/:id', blogController.putABlog)
router.delete('/:id', blogController.deleteABlog)

module.exports = router;