const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatByProject
} = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Send a message (protected)
router.post('/', authMiddleware, sendMessage);

// Get chat history for a project (protected)
router.get('/:projectId', authMiddleware, getChatByProject);

module.exports = router;