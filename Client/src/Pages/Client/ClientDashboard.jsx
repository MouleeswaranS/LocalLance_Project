import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function ClientDashboard() {
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

  const [location, setLocation] = useState("");
  const [bookingLoading, setBookingLoading] = useState(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const additionalServicesRef = useRef(null);
  const additionalServiceCardsRef = useRef([]);
  const actionsRef = useRef(null);
  const actionCardsRef = useRef([]);

  const services = [
    {
      id: 1,
      name: "Home Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
      description: "Professional home cleaning services",
      price: "₹299",
      rating: 4.8,
      reviews: 1250,
    },
    {
      id: 2,
      name: "Plumbing",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
      description: "Expert plumbing repairs and installations",
      price: "₹199",
      rating: 4.7,
      reviews: 890,
    },
    {
      id: 3,
      name: "Electrical Work",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop",
      description: "Licensed electricians for all your needs",
      price: "₹249",
      rating: 4.9,
      reviews: 756,
    },
    {
      id: 4,
      name: "Carpentry",
      image: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=250&fit=crop",
      description: "Custom furniture and woodwork",
      price: "₹349",
      rating: 4.6,
      reviews: 634,
    },
    {
      id: 5,
      name: "Mechanics",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop",
      description: "Professional vehicle repair and maintenance",
      price: "₹499",
      rating: 4.7,
      reviews: 756,
    },
    {
      id: 6,
      name: "Gardening",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      description: "Lawn care and garden maintenance",
      price: "₹179",
      rating: 4.5,
      reviews: 543,
    },
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Smooth entry animation for first section (Hero)
    const entryTl = gsap.timeline();

    gsap.set(titleRef.current, {
      opacity: 0,
      y: -50
    });
    gsap.set(subtitleRef.current, {
      opacity: 0,
      y: 50
    });
    gsap.set(searchRef.current, {
      opacity: 0,
      scale: 0.8
    });

    entryTl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    }, "-=0.8")
    .to(searchRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: "power2.out",
    }, "-=0.6");

    // Scroll-triggered animations for services (3 columns: left from left, center from top, right from right)
    serviceCardsRef.current.filter(Boolean).forEach((card, index) => {
      const column = index % 3;
      let initialProps = { opacity: 0, scale: 0.8 };
      if (column === 0) initialProps.x = -100; // left column
      else if (column === 1) initialProps.y = -100; // center column
      else initialProps.x = 100; // right column

      gsap.set(card, initialProps);

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
        animation: gsap.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: index * 0.1
        }),
      });
    });

    // Scroll-triggered animations for additional services (3 columns: left from left, center from top, right from right)
    additionalServiceCardsRef.current.filter(Boolean).forEach((card, index) => {
      const column = index % 3;
      let initialProps = { opacity: 0, scale: 0.8 };
      if (column === 0) initialProps.x = -100; // left column
      else if (column === 1) initialProps.y = -100; // center column
      else initialProps.x = 100; // right column

      gsap.set(card, initialProps);

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
        animation: gsap.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: index * 0.1
        }),
      });
    });

    // Scroll-triggered animations for actions (3 columns: left from left, center from top, right from right)
    actionCardsRef.current.filter(Boolean).forEach((card, index) => {
      const column = index % 3;
      let initialProps = { opacity: 0, scale: 0.8 };
      if (column === 0) initialProps.x = -100; // left column
      else if (column === 1) initialProps.y = -100; // center column
      else initialProps.x = 100; // right column

      gsap.set(card, initialProps);

      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none reverse",
        animation: gsap.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
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

  const handleQuickBook = async (service) => {
    setBookingLoading(service.id);

    const { value: date } = await Swal.fire({
      title: 'Select Date',
      input: 'date',
      inputLabel: 'Choose a date for the service',
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

    if (!date) {
      setBookingLoading(null);
      return;
    }

    const { value: time } = await Swal.fire({
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

    if (!time) {
      setBookingLoading(null);
      return;
    }

    const { value: serviceLocation } = await Swal.fire({
      title: 'Service Location',
      input: 'text',
      inputLabel: 'Enter the service location',
      inputPlaceholder: 'e.g., Home address, Office address',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a location!';
        }
      }
    });

    if (!serviceLocation) {
      setBookingLoading(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bookings', {
        freelancerId: Math.floor(Math.random() * 1000).toString(), // Generate random freelancer ID for demo
        freelancerName: `Professional ${service.name} Expert`,
        service: service.name,
        date,
        time,
        location: serviceLocation,
        price: service.price
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookingLoading(null);
      Swal.fire({
        title: 'Success!',
        text: 'Your booking has been created successfully',
        icon: 'success',
        confirmButtonText: 'View My Bookings'
      }).then(() => {
        window.location.href = '/client/bookings';
      });
    } catch (error) {
      setBookingLoading(null);
      console.error('Booking error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to create booking. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
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
        {/* Animated background elements */}
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
              Find Trusted Freelancers Near You
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl mb-8 text-blue-100"
            >
              Book verified professionals for all your home and business needs
            </p>

            {/* Location Search */}
            <div
              ref={searchRef}
              className="max-w-md mx-auto"
            >
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-transparent"
                />
                <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 font-semibold transition-colors text-white">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div
        ref={servicesRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Popular Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (serviceCardsRef.current[index] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">
                      {service.rating}
                    </span>
                    <span className="ml-1 text-gray-500 text-sm">
                      ({service.reviews})
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {service.price}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook(service)}
                    disabled={bookingLoading === service.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === service.id ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent(service.name)}`}
                    state={{ service }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Services for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete range of professional services to make your life easier and more convenient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bike & Car Repair */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[0] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop"
                alt="Bike & Car Repair"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bike & Car Repair</h3>
                <p className="text-gray-600 text-sm mb-4">Professional repair and maintenance services for motorcycles and cars</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹399</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">4.7</span>
                    <span className="ml-1 text-gray-500 text-sm">(1,034)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook({ id: 7, name: "Bike & Car Repair", price: "₹399" })}
                    disabled={bookingLoading === 7}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === 7 ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent("Bike & Car Repair")}`}
                    state={{ service: { name: "Bike & Car Repair" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* AC & Appliance Repair */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[1] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src="https://loremflickr.com/400/250/air+conditioner+repair"
                alt="AC & Appliance Repair"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AC & Appliance Repair</h3>
                <p className="text-gray-600 text-sm mb-4">Expert repair and maintenance services for all your home appliances</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹349</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">4.7</span>
                    <span className="ml-1 text-gray-500 text-sm">(1,203)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook({ id: 8, name: "AC & Appliance Repair", price: "₹349" })}
                    disabled={bookingLoading === 8}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === 8 ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent("AC & Appliance Repair")}`}
                    state={{ service: { name: "AC & Appliance Repair" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* Home Painting */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[2] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=250&fit=crop"
                alt="Home Painting"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Painting</h3>
                <p className="text-gray-600 text-sm mb-4">Professional interior and exterior painting services with premium quality paints</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹799</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">4.5</span>
                    <span className="ml-1 text-gray-500 text-sm">(756)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook({ id: 9, name: "Home Painting", price: "₹799" })}
                    disabled={bookingLoading === 9}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === 9 ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent("Home Painting")}`}
                    state={{ service: { name: "Home Painting" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* Cleaning & Pest Control */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[3] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
                alt="Cleaning & Pest Control"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cleaning & Pest Control</h3>
                <p className="text-gray-600 text-sm mb-4">Complete home cleaning and effective pest control solutions</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹449</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">4.8</span>
                    <span className="ml-1 text-gray-500 text-sm">(1,456)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook({ id: 10, name: "Cleaning & Pest Control", price: "₹449" })}
                    disabled={bookingLoading === 10}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === 10 ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent("Cleaning & Pest Control")}`}
                    state={{ service: { name: "Cleaning & Pest Control" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>

            {/* Electronics & Gadgets */}
            <div
              ref={(el) => (additionalServiceCardsRef.current[4] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=250&fit=crop"
                alt="Electronics & Gadgets"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Electronics & Gadgets</h3>
                <p className="text-gray-600 text-sm mb-4">Repair and maintenance services for all your electronic devices</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₹299</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-gray-700 font-medium">4.4</span>
                    <span className="ml-1 text-gray-500 text-sm">(634)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickBook({ id: 11, name: "Electronics & Gadgets", price: "₹299" })}
                    disabled={bookingLoading === 11}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    {bookingLoading === 11 ? 'Booking...' : 'Book Now'}
                  </button>
                  <Link
                    to={`/client/service/${encodeURIComponent("Electronics & Gadgets")}`}
                    state={{ service: { name: "Electronics & Gadgets" } }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>


          </div>

          <div className="text-center mt-12">
            <Link
              to="/client/browse"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        ref={actionsRef}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              ref={(el) => (actionCardsRef.current[0] = el)}
              to="/client/browse"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Browse Freelancers</h3>
              <p className="text-blue-100">Find the perfect professional for your needs</p>
            </Link>

            <Link
              ref={(el) => (actionCardsRef.current[1] = el)}
              to="/client/bookings"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
              <p className="text-green-100">Manage your upcoming and past services</p>
            </Link>

            <div
              ref={(el) => (actionCardsRef.current[2] = el)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <p className="text-purple-100">Get help from our customer service team</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
