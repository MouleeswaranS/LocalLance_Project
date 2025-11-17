import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

export default function MyBookings() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8
  };

  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({
    upcoming: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const bookingsRef = useRef(null);
  const bookingCardsRef = useRef([]);

  const handleReschedule = async (bookingId) => {
    const { value: newDate } = await Swal.fire({
      title: 'Reschedule Booking',
      input: 'date',
      inputLabel: 'Select new date',
      inputPlaceholder: 'Select date',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a date!';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return 'Please select a future date!';
        }
      }
    });

    if (newDate) {
      const { value: newTime } = await Swal.fire({
        title: 'Select Time',
        input: 'select',
        inputOptions: {
          '9:00 AM': '9:00 AM',
          '10:00 AM': '10:00 AM',
          '11:00 AM': '11:00 AM',
          '12:00 PM': '12:00 PM',
          '1:00 PM': '1:00 PM',
          '2:00 PM': '2:00 PM',
          '3:00 PM': '3:00 PM',
          '4:00 PM': '4:00 PM',
          '5:00 PM': '5:00 PM',
          '6:00 PM': '6:00 PM'
        },
        inputPlaceholder: 'Select time',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to select a time!';
          }
        }
      });

      if (newTime) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`/api/bookings/${bookingId}`, {
            date: newDate,
            time: newTime,
            status: 'confirmed'
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire({
            title: 'Success!',
            text: 'Booking rescheduled successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          fetchBookings(); // Refresh the bookings list
        } catch (error) {
          console.error('Error rescheduling booking:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to reschedule booking',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  };

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Cancel Booking',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/bookings/${bookingId}`, {
          status: 'cancelled'
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your booking has been cancelled.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        fetchBookings(); // Refresh the bookings list
      } catch (error) {
        console.error('Error cancelling booking:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to cancel booking',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedBookings = response.data;
      const categorizedBookings = {
        upcoming: [],
        completed: [],
        cancelled: []
      };

      fetchedBookings.forEach(booking => {
        const bookingData = {
          id: booking._id,
          freelancer: booking.freelancerName,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          location: booking.location,
          status: booking.status,
          price: booking.price,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" // Default image
        };

        if (booking.status === 'pending' || booking.status === 'confirmed') {
          categorizedBookings.upcoming.push(bookingData);
        } else if (booking.status === 'completed') {
          categorizedBookings.completed.push(bookingData);
        } else if (booking.status === 'cancelled') {
          categorizedBookings.cancelled.push(bookingData);
        }
      });

      setBookings(categorizedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load bookings',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Smooth and faster entry animations
    const entryTl = gsap.timeline();

    gsap.set(titleRef.current, {
      opacity: 0,
      scale: 0.1,
      rotationZ: -45,
      y: -100,
      skewX: -15
    });

    entryTl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      rotationZ: 0,
      y: 0,
      skewX: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Scroll-triggered animations for bookings (single column: from left)
    bookingCardsRef.current.filter(Boolean).forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        scale: 0.8,
        x: -100
      });

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
        animation: gsap.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: index * 0.1
        }),
      });
    });

    return () => {
      entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
    ));
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-50"
    >
      <Navbar role="client" />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              My Bookings
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Manage your upcoming and past service bookings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Upcoming ({bookings.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === "completed"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Completed ({bookings.completed.length})
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === "cancelled"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Cancelled ({bookings.cancelled.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div
          ref={bookingsRef}
          className="space-y-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading bookings...</p>
            </div>
          ) : (
            bookings[activeTab].map((booking, index) => (
              <div
                key={booking.id}
                ref={(el) => (bookingCardsRef.current[index] = el)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={booking.image}
                        alt={booking.freelancer}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.freelancer}
                        </h3>
                        <p className="text-gray-600">{booking.service}</p>
                        <p className="text-sm text-gray-500">{booking.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-semibold">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-green-600">{booking.price}</p>
                      </div>

                      <div className="text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      {activeTab === "upcoming" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReschedule(booking.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {activeTab === "completed" && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Your Rating</p>
                          <div className="flex justify-center">
                            {renderStars(booking.rating)}
                          </div>
                          <p className="text-sm text-gray-600 mt-2 italic">"{booking.review}"</p>
                        </div>
                      )}

                      {activeTab === "cancelled" && (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="text-sm text-gray-600">{booking.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {bookings[activeTab].length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No {activeTab} bookings found.</p>
              {activeTab === "upcoming" && (
                <Link
                  to="/client/browse"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse Freelancers
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
