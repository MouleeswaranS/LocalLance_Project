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
        const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers?service=${encodeURIComponent(service.name)}&limit=24`
);
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
      await axios.post(
  `${import.meta.env.VITE_API_URL}/api/bookings/create`,
  {
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
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-24 text-white"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-indigo-500 to-purple-700 opacity-20 blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              ref={titleRef}
              className="mb-4 text-4xl font-bold md:text-5xl"
            >
              {service.name} Services
            </h1>
            <p
              ref={descriptionRef}
              className="mx-auto mb-8 max-w-3xl text-xl text-blue-100"
            >
              {serviceDetails.description}
            </p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-xl bg-white p-8 shadow-lg">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Service Features</h3>
              <ul className="space-y-2">
                {serviceDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Service Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Average Price:</span>
                  <span className="ml-2 font-bold text-green-600">{serviceDetails.averagePrice}</span>
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
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Available {service.name} Professionals ({freelancers.length})
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-xl text-gray-600">Loading freelancers...</p>
              </div>
            ) : freelancers.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-xl text-gray-600">No freelancers found for this service.</p>
              </div>
            ) : (
              freelancers.slice(0, 24).map((freelancer, index) => (
                <div
                  key={freelancer._id}
                  ref={(el) => (freelancerCardsRef.current[index] = el)}
                  className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-center">
                      <img
                        src={freelancer.image}
                        alt={freelancer.name}
                        className="mr-4 h-16 w-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {freelancer.name}
                        </h3>
                        <p className="font-bold text-gray-600">{freelancer.services[0].name}</p>
                        <p className="text-sm text-gray-500">{freelancer.address}</p>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg text-yellow-400">⭐</span>
                        <span className="ml-1 font-medium text-gray-700">
                          {freelancer.rating}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          ({freelancer.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 flex justify-between text-sm text-gray-600">
                      <span>Experience: {freelancer.experience}</span>
                      <span>Jobs: {freelancer.completedJobs}</span>
                    </div>

                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">Hourly Rate</span>
                        <span className="text-lg font-bold text-green-600">{freelancer.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickBook(freelancer)}
                        disabled={bookingLoading === freelancer._id}
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
                      >
                        {bookingLoading === freelancer._id ? 'Booking...' : 'Quick Book'}
                      </button>
                      <Link
                        to={`/client/freelancer/${freelancer._id}`}
                        state={{ freelancer }}
                        className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
            <div className="mt-12 text-center">
              <Link
                to={`/client/browse?service=${encodeURIComponent(service.name)}`}
                className="inline-block transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
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
