import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function BrowseFreelancers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Get service from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedService, selectedLocation]);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const freelancersRef = useRef(null);
  const freelancerCardsRef = useRef([]);

  const services = [
    "Home Cleaning",
    "Plumbing",
    "Electrical Work",
    "Carpentry",
    "Mechanics",
    "Bike & Car Repair",
    "Gardening",
    "AC & Appliance Repair",
    "Home Painting",
    "Cleaning & Pest Control",
    "Electronics & Gadgets"
  ];

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch freelancers from API
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedService) params.append('service', selectedService);
        if (selectedLocation) params.append('location', selectedLocation);
        params.append('limit', '200'); // Fetch more for pagination

        const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/freelancers?${params.toString()}`
);
        const normalizedFreelancers = response.data.map(freelancer => {
          if (freelancer.services && !Array.isArray(freelancer.services)) {
            freelancer.services = Object.values(freelancer.services);
          }
          return freelancer;
        });
        setFreelancers(normalizedFreelancers);
      } catch (error) {
        console.error('Error fetching freelancers:', error);
        // Fallback to empty array if API fails
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [selectedService, selectedLocation]);

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = searchTerm === "" ||
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (freelancer.services && freelancer.services.some(s => {
        const sName = typeof s === 'string' ? s : s?.name;
        return sName?.toLowerCase().includes(searchTerm.toLowerCase());
      }));

    const matchesService = selectedService === "" ||
      (freelancer.services && freelancer.services.some(s => {
        const sName = typeof s === 'string' ? s : s?.name;
        return sName === selectedService;
      }));

    const matchesLocation = selectedLocation === "" || freelancer.address === selectedLocation;

    return matchesSearch && matchesService && matchesLocation;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFreelancers = filteredFreelancers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: freelancersRef.current.offsetTop - 100, behavior: 'smooth' });
  };

  useEffect(() => {
    // Clear previous card references to prevent blank card animations
    freelancerCardsRef.current = [];

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
    gsap.set(searchRef.current, {
      opacity: 0,
      scale: 0.01,
      rotation: 180,
      y: 50
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
    .to(searchRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.3");

    // Smooth scroll-triggered animations for freelancers (only for current page)
    freelancerCardsRef.current.filter(Boolean).forEach((card, index) => {
      const column = index % 3;
      let initialProps = { opacity: 0, scale: 0.8 };
      if (column === 0) initialProps.x = -100; // left column
      else if (column === 1) initialProps.y = -100; // center column
      else initialProps.x = 100; // right column

      gsap.set(card, initialProps);

      ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "play none none reverse",
        animation: gsap.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: (index % 3) * 0.08 // Stagger by column with smaller delay
        }),
        markers: false // Set to true for debugging
      });
    });

    return () => {
      entryTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentPage, searchTerm, selectedService, selectedLocation]); // Re-run animations when page or filters change

  return (
    <div
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
              Find the Perfect Freelancer
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Browse verified professionals and book services instantly
            </p>

            {/* Search and Filters */}
            <div
              ref={searchRef}
              className="max-w-4xl mx-auto space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by name or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="px-4 py-3 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Services</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All Locations</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Surat">Surat</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freelancers Grid */}
      <div
        ref={freelancersRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Available Freelancers ({filteredFreelancers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">Loading freelancers...</p>
            </div>
          ) : filteredFreelancers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No freelancers found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            currentFreelancers.map((freelancer, index) => (
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
                      loading="lazy"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {freelancer.name}
                      </h3>
                      <p className="text-gray-600 font-bold">
                        {freelancer.services && freelancer.services[0] 
                          ? (typeof freelancer.services[0] === 'string' ? freelancer.services[0] : freelancer.services[0].name)
                          : 'No service'}
                      </p>
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

                  <div className="flex gap-2">
                    <Link
                      to={`/client/book/${freelancer._id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                    >
                      Book Now
                    </Link>
                    <Link
                      to={`/client/freelancer/${freelancer._id}`}
                      state={{ freelancer, from: 'browse' }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No freelancers found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
