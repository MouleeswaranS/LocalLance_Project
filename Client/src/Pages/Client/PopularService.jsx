import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function PopularService() {
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

  const { serviceName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service || { name: decodeURIComponent(serviceName || '') };

  // Redirect to browse if service name is not available
  useEffect(() => {
    if (!service.name) {
      navigate('/client/browse');
    }
  }, [service.name, navigate]);



  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const freelancersRef = useRef(null);
  const freelancerCardsRef = useRef([]);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch freelancers from API
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/freelancers?service=${encodeURIComponent(service.name)}&limit=24`);
        setFreelancers(response.data);
      } catch (error) {
        console.error('Error fetching freelancers:', error);
        // Fallback to empty array if API fails
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    if (service.name) {
      fetchFreelancers();
    }
  }, [service.name]);

  const getServiceDetails = (serviceName) => {
    const serviceDetails = {
      "Home Cleaning": {
        description: "Professional home cleaning services to make your space sparkle. Our experienced cleaners use eco-friendly products and modern equipment to deliver thorough cleaning results.",
        features: ["Deep cleaning", "Regular maintenance", "Eco-friendly products", "Flexible scheduling"],
        averagePrice: "₹299-₹499/hr",
        popularIn: ["Delhi", "Mumbai", "Bangalore"]
      },
      "Plumbing": {
        description: "Expert plumbing services for all your water and drainage needs. From minor repairs to major installations, our licensed plumbers ensure reliable solutions.",
        features: ["Leak repairs", "Pipe installations", "Drain cleaning", "Emergency services"],
        averagePrice: "₹199-₹399/hr",
        popularIn: ["Mumbai", "Delhi", "Pune"]
      },
      "Electrical Work": {
        description: "Licensed electricians providing safe and reliable electrical services. From wiring to appliance repairs, we handle all your electrical needs professionally.",
        features: ["Wiring & rewiring", "Appliance repair", "Safety inspections", "Emergency repairs"],
        averagePrice: "₹249-₹499/hr",
        popularIn: ["Bangalore", "Hyderabad", "Chennai"]
      },
      "Carpentry": {
        description: "Custom furniture and woodworking services. Our skilled carpenters create beautiful, functional pieces tailored to your needs.",
        features: ["Custom furniture", "Repairs & restoration", "Installations", "Wood finishing"],
        averagePrice: "₹349-₹699/hr",
        popularIn: ["Delhi", "Mumbai", "Pune"]
      },
      "Mechanics": {
        description: "Professional vehicle repair and maintenance services. Keep your car running smoothly with our certified mechanics.",
        features: ["Engine repairs", "Brake services", "Oil changes", "Diagnostics"],
        averagePrice: "₹499-₹899/hr",
        popularIn: ["All cities"]
      },
      "Gardening": {
        description: "Transform your outdoor space with our professional gardening services. From lawn care to landscaping, we create beautiful gardens.",
        features: ["Lawn mowing", "Planting & pruning", "Landscaping", "Seasonal maintenance"],
        averagePrice: "₹179-₹349/hr",
        popularIn: ["Bangalore", "Pune", "Hyderabad"]
      },
      "AC & Appliance Repair": {
        description: "Expert repair services for all your home appliances and air conditioning systems. Fast, reliable service from certified technicians.",
        features: ["AC repair", "Refrigerator service", "Washing machine repair", "All appliances"],
        averagePrice: "₹349-₹599/hr",
        popularIn: ["Delhi", "Mumbai", "Chennai"]
      },
      "Home Painting": {
        description: "Professional painting services for interior and exterior. Transform your home with our skilled painters using premium quality paints.",
        features: ["Interior painting", "Exterior painting", "Color consultation", "Surface preparation"],
        averagePrice: "₹799-₹1,299/hr",
        popularIn: ["All cities"]
      },
      "Cleaning & Pest Control": {
        description: "Complete cleaning solutions and effective pest control services. Keep your home clean and pest-free with our comprehensive services.",
        features: ["Deep cleaning", "Pest control", "Sanitization", "Regular maintenance"],
        averagePrice: "₹449-₹699/hr",
        popularIn: ["Mumbai", "Delhi", "Bangalore"]
      },
      "Electronics & Gadgets": {
        description: "Repair and maintenance services for all your electronic devices. From smartphones to laptops, our technicians fix it all.",
        features: ["Phone repairs", "Laptop service", "TV repair", "All electronics"],
        averagePrice: "₹299-₹599/hr",
        popularIn: ["All cities"]
      }
    };
    return serviceDetails[serviceName] || {
      description: "Professional service available in your area.",
      features: ["Quality service", "Experienced professionals", "Reliable work"],
      averagePrice: "₹299-₹599/hr",
      popularIn: ["All cities"]
    };
  };

  const serviceDetails = getServiceDetails(service.name);

  useEffect(() => {
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

    gsap.set(descriptionRef.current, {
      opacity: 0,
      x: -50
    });

    entryTl.to(titleRef.current, {
      opacity: 1,
      scale: 1,
      rotationZ: 0,
      y: 0,
      skewX: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    .to(descriptionRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    }, "-=0.3");

    // Scroll-triggered animations for freelancers with column-based entry
    freelancerCardsRef.current.filter(Boolean).forEach((card, index) => {
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
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.05
        }),
      });
    });

    return () => {
      entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleQuickBook = async (freelancer) => {
    setBookingLoading(freelancer.id);

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

    const { value: location } = await Swal.fire({
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

    if (!location) {
      setBookingLoading(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bookings/create', {
        freelancerId: freelancer._id,
        freelancerName: freelancer.name,
        service: freelancer.services[0].name,
        date,
        time,
        address: location,
        price: freelancer.price
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
              {service.name} Services
            </h1>
            <p
              ref={descriptionRef}
              className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
            >
              {serviceDetails.description}
            </p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Features</h3>
              <ul className="space-y-2">
                {serviceDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Service Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Average Price:</span>
                  <span className="ml-2 text-green-600 font-bold">{serviceDetails.averagePrice}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Popular In:</span>
                  <span className="ml-2 text-gray-600">{serviceDetails.popularIn.join(", ")}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Availability:</span>
                  <span className="ml-2 text-gray-600">24/7 Emergency Services Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Freelancers */}
        <div
          ref={freelancersRef}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Available {service.name} Professionals ({freelancers.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">Loading freelancers...</p>
              </div>
            ) : freelancers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">No freelancers found for this service.</p>
              </div>
            ) : (
              freelancers.slice(0, 24).map((freelancer, index) => (
                <div
                  key={freelancer._id}
                  ref={(el) => (freelancerCardsRef.current[index] = el)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={freelancer.image}
                        alt={freelancer.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {freelancer.name}
                        </h3>
                        <p className="text-gray-600 font-bold">{freelancer.services[0].name}</p>
                        <p className="text-sm text-gray-500">{freelancer.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-lg">⭐</span>
                        <span className="ml-1 text-gray-700 font-medium">
                          {freelancer.rating}
                        </span>
                        <span className="ml-1 text-gray-500 text-sm">
                          ({freelancer.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>Experience: {freelancer.experience}</span>
                      <span>Jobs: {freelancer.completedJobs}</span>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600 font-medium">Hourly Rate</span>
                        <span className="text-lg font-bold text-green-600">{freelancer.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickBook(freelancer)}
                        disabled={bookingLoading === freelancer._id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                      >
                        {bookingLoading === freelancer._id ? 'Booking...' : 'Quick Book'}
                      </button>
                      <Link
                        to={`/client/freelancer/${freelancer._id}`}
                        state={{ freelancer }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {freelancers.length > 24 && (
            <div className="text-center mt-12">
              <Link
                to={`/client/browse?service=${encodeURIComponent(service.name)}`}
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View All {service.name} Professionals
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
