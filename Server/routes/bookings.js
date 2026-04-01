const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Freelancer = require('../models/Freelancer');

// Middleware to verify JWT token
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create a new booking
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // FIXED — frontend sends "location", not "address"
    const { freelancerId, freelancerName, service, date, time, location, price } = req.body;
    const clientId = req.user.id;

    // Validate required fields
    if (!freelancerId || !freelancerName || !service || !date || !time || !location || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if client exists
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if freelancer exists
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Create the booking
    const booking = new Booking({
      clientId,
      freelancerId,
      freelancerName,
      freelancerImage: freelancer.image,
      service,
      date,
      time,
      location,     // FIXED
      price,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for a client
router.get('/client', authenticateToken, async (req, res) => {
  try {
    const clientId = req.user.id;

    const bookings = await Booking.find({ clientId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for the authenticated freelancer (using token)
router.get('/freelancer/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the freelancer profile associated with this user
    const freelancer = await Freelancer.findOne({ userId });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    const bookings = await Booking.find({ freelancerId: freelancer._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching freelancer bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for a freelancer (legacy/admin route)
router.get('/freelancer/:freelancerId', authenticateToken, async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const bookings = await Booking.find({ freelancerId })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching freelancer bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (status, date, time)
router.put('/update/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, date, time } = req.body;

    // Build update object dynamically
    const updateFields = {};

    if (status) {
      if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      updateFields.status = status;
    }

    // FIXED — allow updating date/time (reschedule)
    if (date) updateFields.date = date;
    if (time) updateFields.time = time;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateFields,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
