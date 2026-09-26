const Project = require('../models/Project');

// CREATE a project (client only)
exports.createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, duration } = req.body;

    const project = new Project({
      client: req.user.userId,
      title,
      description,
      skillsRequired,
      budget,
      duration,
    });

    await project.save();
    res.status(201).json({ message: 'Project posted successfully', project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all open projects (freelancers browse)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Open' }).populate('client', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET projects posted by logged-in client
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};