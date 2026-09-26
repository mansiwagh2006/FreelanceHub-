const Application = require('../models/Application');
const Project = require('../models/Project');

// Freelancer submits a proposal for a project
exports.submitApplication = async (req, res) => {
  try {
    const { projectId, proposal, rate, portfolioLink } = req.body;
    const freelancerId = req.user.userId;

    // Prevent duplicate applications from the same freelancer on the same project
    const existing = await Application.findOne({ project: projectId, freelancer: freelancerId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }

    const application = await Application.create({
      project: projectId,
      freelancer: freelancerId,
      proposal,
      rate,
      portfolioLink
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Client views all applications for one of their projects
exports.getApplicationsForProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view applications for this project' });
    }

    const applications = await Application.find({ project: req.params.projectId })
      .populate('freelancer', 'name email skills bio profilePic');

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Freelancer views their own submitted applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user.userId })
      .populate('project', 'title budget duration');

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Client accepts or rejects an application
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('project');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.project.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};