const express = require('express');
const router = express.Router();
const reservationController = require('../app/controller/ReservationController');

router.get('/', reservationController.getAllReservations)
router.get('/:id', reservationController.getAReservation)
router.post('/', reservationController.postAReservation)
router.put('/:id', reservationController.putAReservation)
router.delete('/:id', reservationController.deleteAReservation)

module.exports = router;