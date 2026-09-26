const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  experience: {
    type: String, // e.g. "2 years", "Entry level"
    default: ''
  },
  portfolioLink: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Freelancer', freelancerSchema);