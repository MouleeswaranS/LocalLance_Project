import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function FreelancerDashboard() {
  const [stats] = useState({
    totalBookings: 24,
    activeServices: 6,
    earnings: "45,230",
  });

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const bookingsRef = useRef(null);
  const bookingCardsRef = useRef([]);
  const actionsRef = useRef(null);
  const actionCardsRef = useRef([]);

  const services = [
    {
      id: 1,
      name: "Home Cleaning",
      icon: "🧹",
      description: "Professional home cleaning services",
      price: "₹299",
      rating: 4.8,
      bookings: 12,
    },
    {
      id: 2,
      name: "Plumbing",
      icon: "🔧",
      description: "Expert plumbing repairs and installations",
      price: "₹199",
      rating: 4.7,
      bookings: 8,
    },
    {
      id: 3,
      name: "Electrical Work",
      icon: "⚡",
      description: "Licensed electricians for all your needs",
      price: "₹249",
      rating: 4.9,
      bookings: 15,
    },
    {
      id: 4,
      name: "Carpentry",
      icon: "🔨",
      description: "Custom furniture and woodwork",
      price: "₹349",
      rating: 4.6,
      bookings: 6,
    },
    {
      id: 5,
      name: "Painting",
      icon: "🎨",
      description: "Interior and exterior painting services",
      price: "₹399",
      rating: 4.8,
      bookings: 9,
    },
    {
      id: 6,
      name: "Gardening",
      icon: "🌱",
      description: "Lawn care and garden maintenance",
      price: "₹179",
      rating: 4.5,
      bookings: 4,
    },
  ];

  const recentBookings = [
    {
      id: 1,
      service: "Home Cleaning",
      client: "John Doe",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      price: "₹299",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Plumbing",
      client: "Jane Smith",
      date: "Dec 16, 2024",
      time: "2:00 PM",
      price: "₹199",
      status: "pending",
    },
    {
      id: 3,
      service: "Electrical Work",
      client: "Mike Johnson",
      date: "Dec 17, 2024",
      time: "9:00 AM",
      price: "₹249",
      status: "confirmed",
    },
  ];

  useEffect(() => {
    // Check if refs are available before animating
    if (!titleRef.current || !subtitleRef.current || !statsRef.current) return;

    // Entry animations for hero section
    const entryTl = gsap.timeline();

    // Initial setup: hide elements
    gsap.set([titleRef.current, subtitleRef.current], {
      opacity: 0,
      y: 50,
    });
    gsap.set(statsRef.current.children, {
      opacity: 0,
      y: 30,
      scale: 0.9,
    });

    // Animate hero section on entry
    entryTl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power2.out",
    })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.2"
      )
      .to(
        statsRef.current.children,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
          stagger: 0.3,
        },
        "-=0.8"
      );

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="freelancer" />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 relative overflow-hidden"
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
              Grow Your Freelance Business
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl mb-8 text-purple-100"
            >
              Manage your services, track bookings, and connect with more clients
            </p>

            {/* Quick Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.totalBookings}</div>
                <div className="text-purple-200">Total Bookings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">{stats.activeServices}</div>
                <div className="text-purple-200">Active Services</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">₹{stats.earnings}</div>
                <div className="text-purple-200">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Management */}
      <div
        ref={servicesRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Services</h2>
          <Link
            to="/freelancer/services"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Manage Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (serviceCardsRef.current[index] = el)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{service.icon}</span>
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
                      ({service.bookings} bookings)
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {service.price}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div
        ref={bookingsRef}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Bookings</h2>
            <Link
              to="/freelancer/bookings"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <div
                key={booking.id}
                ref={(el) => (bookingCardsRef.current[index] = el)}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {booking.service}
                    </h3>
                    <p className="text-gray-600 mb-2">{booking.client}</p>
                    <p className="text-sm text-gray-500">{booking.date} • {booking.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-2">
                      {booking.price}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        ref={actionsRef}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              ref={(el) => (actionCardsRef.current[0] = el)}
              to="/freelancer/services"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-xl font-semibold mb-2">Add Service</h3>
              <p className="text-purple-100">Create new service offerings</p>
            </Link>

            <Link
              ref={(el) => (actionCardsRef.current[1] = el)}
              to="/freelancer/bookings"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
              <p className="text-green-100">Handle client bookings and schedules</p>
            </Link>

            <div
              ref={(el) => (actionCardsRef.current[2] = el)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl text-center"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-blue-100">View earnings and performance stats</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
