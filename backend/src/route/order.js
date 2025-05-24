const express = require('express')
const router = express.Router()
// const employeeRouter = express.Router()
// const managerRouter = express.Router()
const orderController = require('../app/controller/OrderController')

router.get('/', orderController.getAllOrders)
router.get('/:id', orderController.getAOrder)
router.post('/', orderController.createAnOrder)
router.post('/combine_orders', orderController.combineOrders)
router.put('/:id', orderController.putAOrder)
router.delete('/:id', orderController.deleteAOrder)
// router.put('/late/checking', orderController.checkLate)
// router.put('/late/checked/:id', orderController.checkedLate)

// router.post('/', orderController.createAnOrder)
// router.use('/employee', employeeRouter)
// router.use('/manager', managerRouter)
// employeeRouter.put('/:id', orderController.orderDelivered)
// managerRouter.put('/:id', orderController.orderDeclined)

module.exports = router