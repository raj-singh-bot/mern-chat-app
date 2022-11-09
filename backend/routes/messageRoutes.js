const express = require('express')
const { createMessage, allMessage } = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(protect, createMessage)
router.route('/:chatId').get(protect, allMessage) ;

module.exports = router