require('dotenv').config()

const express = require('express')
const router = express.Router()
const dataHandlingController = require('../app/controller/DataHandlingController')

router.get(`/${process.env.API_KEY}`, dataHandlingController.readAllDataLinks)
router.post(`/${process.env.API_KEY}`, dataHandlingController.createADataLink)

module.exports = router