const express = require('express');
const router = express.Router();
const brandController = require('../app/controller/BrandController');

router.get('/', brandController.readAllBrands)
router.get('/:id', brandController.readABrand)
router.post('/', brandController.createABrand)
router.put('/:id', brandController.updateABrand)
router.delete('/:id', brandController.deleteABrand)

module.exports = router;