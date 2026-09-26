const Freelancer = require('../models/Freelancer');
const User = require('../models/User');

// Create or update freelancer profile (for the logged-in user)
exports.upsertFreelancerProfile = async (req, res) => {
  try {
    const { experience, portfolioLink, hourlyRate } = req.body;
    const userId = req.user.userId;// comes from auth middleware

    let freelancer = await Freelancer.findOne({ user: userId });

    if (freelancer) {
      freelancer.experience = experience ?? freelancer.experience;
      freelancer.portfolioLink = portfolioLink ?? freelancer.portfolioLink;
      freelancer.hourlyRate = hourlyRate ?? freelancer.hourlyRate;
      await freelancer.save();
    } else {
      freelancer = await Freelancer.create({
        user: userId,
        experience,
        portfolioLink,
        hourlyRate
      });
    }

    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get one freelancer's full profile (User + Freelancer merged)
exports.getFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.params.userId })
      .populate('user', 'name email role skills bio profilePic');

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List all freelancers (e.g. for clients to browse)
exports.getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find()
      .populate('user', 'name email role skills bio profilePic');

    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};