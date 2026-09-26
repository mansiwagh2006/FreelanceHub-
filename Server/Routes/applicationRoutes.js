const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplicationsForProject,
  getMyApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Freelancer submits a proposal (protected)
router.post('/', authMiddleware, submitApplication);

// Freelancer views their own applications (protected)
router.get('/my-applications', authMiddleware, getMyApplications);

// Client views all applications for a specific project (protected)
router.get('/project/:projectId', authMiddleware, getApplicationsForProject);

// Client accepts/rejects an application (protected)
router.patch('/:id/status', authMiddleware, updateApplicationStatus);

module.exports = router;