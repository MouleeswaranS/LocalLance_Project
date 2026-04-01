const mongoose = require('mongoose');

// -------------------------------
// FREELANCER MAIN SCHEMA
// -------------------------------
const freelancerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,        // set to true if freelancers must be tied to a user account
  },

  name: {
    type: String,
    required: true,
  },

  services: {
    type: [{
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: String, required: true },
      category: { type: String, required: true },
      rating: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 }
    }],
    default: []
  },

  address: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5,
  },

  reviews: {
    type: Number,
    default: 0,
  },

  price: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  experience: {
    type: String,
    required: true,
  },

  completedJobs: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    default: []
  },

  availability: {
    type: String,
    required: true,
  },

  responseTime: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Freelancer", freelancerSchema);
