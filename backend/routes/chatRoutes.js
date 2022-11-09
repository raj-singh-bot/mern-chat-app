const express = require('express')
const { accessChat, fetchChat, createGroupChat, renameGroupChat, addGroupUser, removeGroupUser } = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router() 

router.route('/').post(protect, accessChat).get(protect, fetchChat)

router.route('/group').post(protect, createGroupChat)

router.route('/renameGroup').put(protect, renameGroupChat)

router.route('/addUser').put(protect, addGroupUser)

router.route('/removeUser').put(protect, removeGroupUser)
module.exports = router;