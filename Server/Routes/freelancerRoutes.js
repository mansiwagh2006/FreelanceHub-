const express = require('express');
const router = express.Router();
const {
  upsertFreelancerProfile,
  getFreelancerProfile,
  getAllFreelancers
} = require('../controllers/freelancerController');
const authMiddleware = require('../middleware/authMiddleware');

// Create or update your own freelancer profile (protected)
router.post('/profile', authMiddleware, upsertFreelancerProfile);

// Get all freelancers (public - clients browsing)
router.get('/', getAllFreelancers);

// Get one freelancer's profile by their user ID (public)
router.get('/:userId', getFreelancerProfile);

module.exports = router;