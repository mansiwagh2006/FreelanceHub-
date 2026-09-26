const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  budget: { type: Number, required: true },
  duration: { type: String },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);