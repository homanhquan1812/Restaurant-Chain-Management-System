const express = require('express');
const router = express.Router();
const branchController = require('../app/controller/BranchController');

router.get('/', branchController.readAllBranches)
router.get('/:id', branchController.readABranch)
router.post('/', branchController.createABranch)
router.put('/:id', branchController.updateABranch)
router.delete('/:id', branchController.deleteABranch)

module.exports = router;