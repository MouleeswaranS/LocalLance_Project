const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { freelancerId, freelancerName, service, date, time, location, price } = req.body;
    const clientId = req.user.id;

    const booking = new Booking({
      clientId,
      freelancerId,
      freelancerName,
      service,
      date,
      time,
      location,
      price,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for a user (client or freelancer)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let bookings;
    if (user.role === 'client') {
      bookings = await Booking.find({ clientId: userId })
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ freelancerId: userId })
        .populate('clientId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if user is authorized to update this booking
    if (booking.clientId.toString() !== userId && booking.freelancerId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
