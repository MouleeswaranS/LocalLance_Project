// Server/routes/freelancers.js
const express = require('express');
const Freelancer = require('../models/Freelancer');
const Booking = require('../models/Booking');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/* ---------------------------------------------------
   1) FREELANCER DASHBOARD
   URL: GET /api/freelancers/dashboard/:id
   Requires: Authorization: Bearer <token>
----------------------------------------------------*/
/* ---------------------------------------------------
   GET CURRENT FREELANCER PROFILE
   URL: GET /api/freelancers/profile/me
----------------------------------------------------*/
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    let freelancer = await Freelancer.findOne({ userId: req.user.id });

    // Auto-create profile if missing
    if (!freelancer) {
      const user = req.user;
      freelancer = new Freelancer({
        userId: user.id,
        name: user.name || 'New Freelancer',
        email: user.email,
        services: [],
        price: '₹299',
        description: 'No description yet.',
        category: 'General',
        rating: 0,
        bookings: 0,
        image: 'https://via.placeholder.com/150',
        address: 'Not provided',
        experience: '0 years',
        availability: 'Available',
        responseTime: '1 hour'
      });
      await freelancer.save();
    }

    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------
   UPDATE CURRENT FREELANCER PROFILE
   URL: PUT /api/freelancers/profile/me
----------------------------------------------------*/
router.put('/profile/me', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    let freelancer = await Freelancer.findOne({ userId: req.user.id });

    if (!freelancer) {
      // Create if missing before update
      const user = req.user;
      freelancer = new Freelancer({
        userId: user.id,
        name: user.name || 'New Freelancer',
        price: '₹299',
        description: 'No description yet.',
        image: 'https://via.placeholder.com/150',
        address: 'Not provided',
        experience: '0 years',
        availability: 'Available',
        responseTime: '1 hour',
        services: []
      });
      await freelancer.save();
    }

    Object.keys(updates).forEach((key) => {
      freelancer[key] = updates[key];
    });

    await freelancer.save();
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/* ---------------------------------------------------
   1) FREELANCER DASHBOARD (CURRENT USER)
   URL: GET /api/freelancers/dashboard/me
   Requires: Authorization: Bearer <token>
----------------------------------------------------*/
router.get('/dashboard/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let freelancer = await Freelancer.findOne({ userId: user.id });

    // Auto-create profile if missing
    if (!freelancer) {
      freelancer = new Freelancer({
        userId: user.id,
        name: user.name || 'New Freelancer',
        price: '₹299',
        description: 'No description yet.',
        image: 'https://via.placeholder.com/150',
        address: 'Not provided',
        experience: '0 years',
        availability: 'Available',
        responseTime: '1 hour',
        services: []
      });
      await freelancer.save();
    }

    const freelancerId = freelancer._id;

    // Booking counts
    const totalBookings = await Booking.countDocuments({ freelancerId });
    const activeBookings = await Booking.countDocuments({
      freelancerId,
      status: { $in: ['pending', 'confirmed'] }
    });
    const completedBookings = await Booking.countDocuments({
      freelancerId,
      status: 'completed'
    });

    // Recent bookings (populate client)
    const recentBookings = await Booking.find({ freelancerId })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Compute total earnings
    const completedDocs = await Booking.find({ freelancerId, status: 'completed' }).lean();
    let totalEarnings = 0;
    completedDocs.forEach(b => {
      if (!b || !b.price) return;
      const numeric = parseFloat(String(b.price).replace(/[^\d.]/g, ''));
      if (!Number.isNaN(numeric)) totalEarnings += numeric;
    });

    res.json({
      stats: {
        totalBookings,
        activeBookings,
        completedBookings,
        totalEarnings
      },
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
});

/* ---------------------------------------------------
   1) FREELANCER DASHBOARD
   URL: GET /api/freelancers/dashboard/:id
   Requires: Authorization: Bearer <token>
----------------------------------------------------*/
router.get('/dashboard/:id', authenticateToken, async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const user = req.user; // injected by authenticateToken middleware

    // Validate freelancer
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });

    // Only owner can access their dashboard
    if (!freelancer.userId || freelancer.userId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Booking counts
    const totalBookings = await Booking.countDocuments({ freelancerId });
    const activeBookings = await Booking.countDocuments({
      freelancerId,
      status: { $in: ['pending', 'confirmed'] }
    });
    const completedBookings = await Booking.countDocuments({
      freelancerId,
      status: 'completed'
    });

    // Recent bookings (populate client)
    const recentBookings = await Booking.find({ freelancerId })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Compute total earnings from completed bookings robustly in JS
    const completedDocs = await Booking.find({ freelancerId, status: 'completed' }).lean();

    let totalEarnings = 0;
    completedDocs.forEach(b => {
      if (!b || !b.price) return;
      // Remove currency symbols and commas, parse number
      const numeric = parseFloat(String(b.price).replace(/[^\d.]/g, ''));
      if (!Number.isNaN(numeric)) totalEarnings += numeric;
    });

    // Return normalized shape (easier for frontend)
    res.json({
      stats: {
        totalBookings,
        activeBookings,
        completedBookings,
        totalEarnings
      },
      recentBookings
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
});

/* ---------------------------------------------------
   GET FREELANCERS BY SERVICE
   URL: GET /api/freelancers/service/:serviceName
----------------------------------------------------*/
router.get('/service/:serviceName', async (req, res) => {
  try {
    const freelancers = await Freelancer.find({
      'services.name': req.params.serviceName
    }).sort({ rating: -1 });

    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------
   GET ALL FREELANCERS (with filters)
   URL: GET /api/freelancers?service=...&location=...
----------------------------------------------------*/
router.get('/', async (req, res) => {
  try {
    const { service, location } = req.query;
    const query = {};
    if (service) query['services.name'] = service;
    if (location) query.address = location;

    const freelancers = await Freelancer.find(query).sort({ rating: -1, reviews: -1 });
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------
   GET FREELANCER BY ID
   URL: GET /api/freelancers/:id
----------------------------------------------------*/
router.get('/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });
    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ---------------------------------------------------
   UPDATE FREELANCER PROFILE (Services, etc.)
   URL: PUT /api/freelancers/:id
   Requires: Authorization: Bearer <token>
----------------------------------------------------*/
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const user = req.user; // injected by authenticateToken
    const updates = req.body;

    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer) return res.status(404).json({ message: 'Freelancer not found' });

    // Authorization check
    if (!freelancer.userId || freelancer.userId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      freelancer[key] = updates[key];
    });

    await freelancer.save();
    res.json(freelancer);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
