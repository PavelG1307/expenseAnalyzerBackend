const express = require('express')
const router = express.Router()
const expense = require('../controllers/expense')

router.get('/', expense('get'))
router.post('/', expense('create'))

module.exports = router