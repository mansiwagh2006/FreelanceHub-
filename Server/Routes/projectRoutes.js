const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/my-projects', protect, projectController.getMyProjects);
router.get('/:id', projectController.getProjectById);

module.exports = router;